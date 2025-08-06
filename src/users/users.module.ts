import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    try {
      // Seed sample data when the module initializes
      await this.usersService.seedSampleData();
      console.log('✅ Sample data seeded successfully');
    } catch (error) {
      console.error('❌ Failed to seed sample data:', error.message);
      // Don't throw error - let the app continue even if seeding fails
    }
  }
}