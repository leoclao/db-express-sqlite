import "reflect-metadata";
import { DataSource } from "typeorm";
import { PostEntity } from "../entities/PostEntity";
import { CategoryEntity } from "../entities/CategoryEntity";
import { UserEntity } from "../entities/UserEntity";
import { ContactEntity } from "../entities/ContactEntity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: './db/dev.sqlite',
  synchronize: true,
  logging: false,
  entities: [PostEntity, CategoryEntity, UserEntity, ContactEntity],
  // migrations: ["src/migrations/*.ts"],
});