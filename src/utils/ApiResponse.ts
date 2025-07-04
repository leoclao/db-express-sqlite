export class ApiResponse {
  static success(data: any, message: string = 'Success', statusCode: number = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(message: string = 'Error', statusCode: number = 500, errors?: any) {
    return {
      success: false,
      statusCode,
      message,
      ...(errors && { errors }),
    };
  }

  static paginated(data: any[], total: number, page: number, limit: number, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}