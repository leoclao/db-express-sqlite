import { AppDataSource } from '../../config/ormconfig';
import { UserEntity, CategoryEntity, PostEntity } from '../../entities';
import bcrypt from 'bcryptjs';

export class DataSeeder {
  static async seed(): Promise<void> {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const categoryRepo = AppDataSource.getRepository(CategoryEntity);
    const postRepo = AppDataSource.getRepository(PostEntity);

    console.log('Starting data seeding...');

    // Create default admin user
    const adminExists = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await userRepo.save({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Create default categories
    const categories = [
      { name: 'Technology', description: 'Tech related posts' },
      { name: 'News', description: 'Latest news and updates' },
      { name: 'Tutorial', description: 'Step-by-step tutorials' },
      { name: 'Review', description: 'Product and service reviews' },
      { name: 'Opinion', description: 'Opinion pieces and editorials' }
    ];

    for (const categoryData of categories) {
      const exists = await categoryRepo.findOne({ where: { name: categoryData.name } });
      if (!exists) {
        await categoryRepo.save(categoryData);
        console.log(`Category '${categoryData.name}' created`);
      }
    }

    // Create sample posts
    const techCategory = await categoryRepo.findOne({ where: { name: 'Technology' } });
    const tutorialCategory = await categoryRepo.findOne({ where: { name: 'Tutorial' } });

    if (techCategory && tutorialCategory) {
      const samplePosts = [
        {
          title: 'Getting Started with Node.js',
          content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine...',
          categoryId: techCategory.id,
          type: 'tutorial',
          status: 'published'
        },
        {
          title: 'Best Practices for API Development',
          content: 'When building APIs, there are several best practices to follow...',
          categoryId: techCategory.id,
          type: 'article',
          status: 'published'
        },
        {
          title: 'Database Design Fundamentals',
          content: 'Understanding database design principles is crucial for building scalable applications...',
          categoryId: tutorialCategory.id,
          type: 'tutorial',
          status: 'published'
        }
      ];

      for (const postData of samplePosts) {
        const exists = await postRepo.findOne({ where: { title: postData.title } });
        if (!exists) {
          await postRepo.save(postData);
          console.log(`Post '${postData.title}' created`);
        }
      }
    }

    console.log('Data seeding completed!');
  }

  static async run(): Promise<void> {
    try {
      await AppDataSource.initialize();
      await this.seed();
      await AppDataSource.destroy();
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }
}