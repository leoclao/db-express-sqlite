import { AppDataSource } from '../config/ormconfig';
import { UserEntity } from '../entities/UserEntity';
import { InterfaceUser } from '../types';

export const createUser = async (user: InterfaceUser) => {
  const repo = AppDataSource.getRepository(UserEntity);
  const newUser = repo.create(user);
  const result = await repo.save(newUser);
  return result;
};

export const getUsers = async () => {
  const repo = AppDataSource.getRepository(UserEntity);
  const users = await repo.find();
  return users.map(user => ({
    ...user,
    address: user.address ? JSON.stringify(user.address) : null,
    company: user.company ? JSON.stringify(user.company) : null,
  }));
};

export const getUserById = async (id: number) => {
  const repo = AppDataSource.getRepository(UserEntity);
  return await repo.findOneBy({ id });
};