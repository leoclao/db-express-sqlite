import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { InterfaceUser } from "../types";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         address:
 *           type: object
 *           description: The address of the user.
 *         phone:
 *           type: string
 *           description: The phone number of the user.
 *         website:
 *           type: string
 *           description: The website of the user.
 *         company:
 *           type: object
 *           description: The company information of the user.
 */

@Entity()
export class UserEntity implements InterfaceUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  email!: string;

  @Column({ type: "text", nullable: true })
  address!: InterfaceUser["address"];

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: "text", nullable: true })
  company?: InterfaceUser["company"];
}