import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { InterfacePost } from "../types";
import { CategoryEntity } from "./CategoryEntity";

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the post.
 *         slug:
 *           type: string
 *           description: The unique slug of the post.
 *         title:
 *           type: string
 *           description: The title of the post.
 *         categoryId:
 *           type: integer
 *           description: The ID of the category this post belongs to.
 *         excerpt:
 *           type: string
 *           description: A short excerpt of the post.
 *         content:
 *           type: string
 *           description: The full content of the post.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the post was created.
 *         userId:
 *           type: integer
 *           description: The ID of the user who created the post.
 *         type:
 *           type: string
 *           enum: ["about", "blog", "event", "service"]
 */

@Entity()
export class PostEntity implements InterfacePost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column()
  categoryId!: number;

  @Column()
  excerpt!: string;

  @Column()
  content!: string;

  @Column()
  createdAt!: string;

  @Column()
  userId!: number;

  @Column()
  type!: "about" | "blog" | "event" | "service";

  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  category!: CategoryEntity;
}