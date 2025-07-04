export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, number> = new Map();
  private requestCounts: Map<string, number> = new Map();
  private responseTimes: Map<string, number[]> = new Map();

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  recordRequest(endpoint: string, method: string, statusCode: number, duration: number): void {
    const key = `${method}:${endpoint}`;
    
    // Count requests
    this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
    
    // Track response times
    const times = this.responseTimes.get(key) || [];
    times.push(duration);
    this.responseTimes.set(key, times);
    
    // Count status codes
    const statusKey = `${key}:${statusCode}`;
    this.metrics.set(statusKey, (this.metrics.get(statusKey) || 0) + 1);
  }

  recordError(endpoint: string, method: string, error: Error): void {
    const key = `${method}:${endpoint}:errors`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  getMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};

    // Request counts
    for (const [key, count] of this.requestCounts) {
      metrics[`requests_${key}`] = count;
    }

    // Response time statistics
    for (const [key, times] of this.responseTimes) {
      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const sorted = times.sort((a, b) => a - b);
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const p99 = sorted[Math.floor(sorted.length * 0.99)];

        metrics[`response_time_avg_${key}`] = Math.round(avg);
        metrics[`response_time_p95_${key}`] = p95;
        metrics[`response_time_p99_${key}`] = p99;
        metrics[`response_time_min_${key}`] = Math.min(...times);
        metrics[`response_time_max_${key}`] = Math.max(...times);
      }
    }

    // Error counts
    for (const [key, count] of this.metrics) {
      metrics[key] = count;
    }

    return metrics;
  }

  reset(): void {
    this.metrics.clear();
    this.requestCounts.clear();
    this.responseTimes.clear();
  }
}