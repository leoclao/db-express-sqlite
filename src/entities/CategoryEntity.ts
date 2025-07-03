import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PostEntity } from "./PostEntity";
import { InterfaceCategory } from "../types";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the category.
 *         name:
 *           type: string
 *           description: The unique name of the category.
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 *           description: The posts that belong to this category.
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The unique name of the category.
 */

@Entity()
// export class Category {
export class CategoryEntity implements InterfaceCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => PostEntity, (post) => post.category)
  posts!: PostEntity[];
}
