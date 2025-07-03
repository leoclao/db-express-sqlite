import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { InterfaceContact } from "../types";

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the contact.
 *         name:
 *           type: string
 *           description: The name of the contact.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the contact.
 *         message:
 *           type: string
 *           description: The message sent by the contact.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the contact was created.
 */

@Entity()
export class ContactEntity implements InterfaceContact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  message!: string;

  @Column()
  createdAt!: string;
}