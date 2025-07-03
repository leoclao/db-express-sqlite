import { AppDataSource } from '../config/ormconfig';
import { InterfacePost } from '../types';
import { PostEntity } from '../entities/PostEntity';

export const createPostModel = async (data: Partial<InterfacePost>) => {
  const repo = AppDataSource.getRepository(PostEntity);
  const post = repo.create(data);
  const result = await repo.save(post);
  return result;
};

export const updatePostModel = async (id: number, data: Partial<InterfacePost>) => {
  
  const repo = AppDataSource.getRepository(PostEntity);
  await repo.update(id, data);
  return await repo.findOneBy({ id });
};

export const deletePostModel = async (id: number) => {
  const repo = AppDataSource.getRepository(PostEntity);
  return await repo.delete(id);
};

export const resetPostsModel = async () => {
  const repo = AppDataSource.getRepository(PostEntity);
  return await repo.clear();
};

export const getPostsModel = async (
  limit: number = 10,
  offset: number = 0,
  sort: string = 'createdAt',
  order: string = 'DESC'
) => {
  const repo = AppDataSource.getRepository(PostEntity);
  const queryBuilder = repo.createQueryBuilder('post')
    .orderBy(`post.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
    .skip(offset)
    .take(limit);
  return await queryBuilder.getMany();
};

export const getPostsByIdModel = async ( id: number ) => {
  const repo = AppDataSource.getRepository(PostEntity);
  return await repo.findOneBy({ id });
};

export const getPostsByCategoryIdModel = async (categoryId: number) => {
  const repo = AppDataSource.getRepository(PostEntity);
  return await repo.find({ where: { categoryId } });
};

export const getLatestPostsModel = async (limit: number = 5) => {
  const repo = AppDataSource.getRepository(PostEntity);
  return await repo.find({ order: { createdAt: "DESC" }, take: limit });
};

export const getPostsByTypeModel = async (type: string) => {
  const repo = AppDataSource.getRepository(PostEntity);
  return await repo.find({ where: { type: type as PostEntity["type"] } });
};
