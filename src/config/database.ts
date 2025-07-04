import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./index";
import {
  UserEntity,
  PostEntity,
  CategoryEntity,
  ContactEntity,
} from "../entities";

export const AppDataSource = new DataSource({
  type: config.database.type,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [UserEntity, PostEntity, CategoryEntity, ContactEntity],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
  extra: {
    journal_mode: "WAL",
    synchronous: "NORMAL",
    cache_size: -64000,
    temp_store: "MEMORY",
    mmap_size: 268435456,
  },
  // poolSize: 1,
  // acquireTimeout: 30000,
  // timeout: 30000,
  // entities: ["src/entities/*.ts"],
  // cli: {
  //   entitiesDir: "src/entities",
  //   migrationsDir: "src/migrations",
  //   subscribersDir: "src/subscribers",
  // },
});
