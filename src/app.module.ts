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
        const nodeEnv = configService.get('NODE_ENV', 'development');
        
        // Check for Railway environment variables
        const pgHost = configService.get('PGHOST');
        const pgPort = configService.get('PGPORT');
        const pgUser = configService.get('PGUSER');
        const pgPassword = configService.get('PGPASSWORD');
        const pgDatabase = configService.get('PGDATABASE');
        const databaseUrl = configService.get('DATABASE_URL');
        
        console.log('🔧 Database configuration:');
        console.log('NODE_ENV:', nodeEnv);
        console.log('PGHOST:', pgHost);
        console.log('DATABASE_URL present:', !!databaseUrl);
        
        if (pgHost && pgUser && pgPassword && pgDatabase) {
          console.log('🚂 Using Railway individual parameters configuration');
          // Railway deployment - use individual parameters for better control
          return {
            type: 'postgres' as const,
            host: pgHost,
            port: parseInt(pgPort || '5432'),
            username: pgUser,
            password: pgPassword,
            database: pgDatabase,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: nodeEnv !== 'production',
            logging: nodeEnv !== 'production',
            ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
            name: 'default',
            extra: {
              // Force IPv4 and add connection options for Railway
              family: 4,
              connectionTimeoutMillis: 15000,
              idleTimeoutMillis: 30000,
              max: 10,
            },
          };
        } else if (databaseUrl) {
          console.log('🚂 Using Railway DATABASE_URL configuration');
          // Fallback to DATABASE_URL
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: nodeEnv !== 'production',
            logging: nodeEnv !== 'production',
            ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
            name: 'default',
            extra: {
              family: 4,
              connectionTimeoutMillis: 15000,
              idleTimeoutMillis: 30000,
              max: 10,
            },
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
            name: 'default',
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
