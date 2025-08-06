import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Check if we have DATABASE_URL (Railway style)
        const databaseUrl = configService.get('DATABASE_URL');
        const nodeEnv = configService.get('NODE_ENV', 'development');
        
        console.log('🔧 Database configuration:');
        console.log('NODE_ENV:', nodeEnv);
        console.log('DATABASE_URL present:', !!databaseUrl);
        
        if (databaseUrl) {
          console.log('🚂 Using Railway DATABASE_URL configuration');
          // Railway deployment - use DATABASE_URL
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: nodeEnv !== 'production',
            logging: nodeEnv !== 'production',
            ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
            name: 'default', // Explicitly set connection name
          };
        } else {
          console.log('🏠 Using local development configuration');
          // Local development - use individual parameters
          const dbConfig = {
            type: 'postgres' as const,
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD', 'password123'),
            database: configService.get('DB_DATABASE', 'nestjs_db'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: nodeEnv !== 'production',
            logging: nodeEnv !== 'production',
            name: 'default', // Explicitly set connection name
          };
          console.log('DB Config:', { ...dbConfig, password: '***' });
          return dbConfig;
        }
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
