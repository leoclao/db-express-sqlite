import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexes1640000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(categoryId);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(createdAt);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_posts_category_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_posts_created_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_posts_type;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_posts_title;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_categories_name;`);
  }
}