import { Repository } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { UserEntity } from '../entities/UserEntity';
import { InterfaceUser } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  async createUser(userData: Partial<InterfaceUser>): Promise<UserEntity> {
    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'name', 'email', 'createdAt'], // Exclude password
      order: { createdAt: 'DESC' }
    });

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt']
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email }
    });
  }

  async authenticateUser(email: string, password: string): Promise<{
    user: UserEntity;
    token: string;
  } | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      user: {
        ...user,
        password: undefined // Remove password from response
      } as UserEntity,
      token
    };
  }

  async updateUser(id: number, updateData: Partial<InterfaceUser>): Promise<UserEntity | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.userRepository.update(id, updateData);
    return await this.getUserById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}