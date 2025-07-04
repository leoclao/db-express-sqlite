export class ApiResponse {
  static success(
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string = "Error",
    statusCode: number = 500,
    errors?: any
  ) {
    return {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
    };
  }

  static paginated(
    data: any[],
    total: number,
    page: number,
    limit: number,
    message: string = "Success"
  ) {
    const totalPages = Math.ceil(total / limit);
    return {
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        from: (page - 1) * limit + 1,
        to: Math.min(page * limit, total),
      },
    };
  }

  static validation(errors: any[]) {
    return {
      success: false,
      statusCode: 422,
      message: 'Validation Error',
      errors,
      timestamp: new Date().toISOString(),
    };
  }
}
