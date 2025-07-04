import { DataSource } from 'typeorm';
import { config } from './index';
import { UserEntity } from '../entities/UserEntity';
import { PostEntity } from '../entities/PostEntity';
import { CategoryEntity } from '../entities/CategoryEntity';
import { ContactEntity } from '../entities/ContactEntity';

export const AppDataSource = new DataSource({
  type: config.database.type,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [UserEntity, PostEntity, CategoryEntity, ContactEntity],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

// src/utils/ApiResponse.ts
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