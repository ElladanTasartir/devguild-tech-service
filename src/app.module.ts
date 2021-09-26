import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AppController } from './app.controller';
import { TechnologyModule } from './modules/technology/technology.module';
import { ormConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TechnologyModule,
    GraphQLModule.forRoot({
      debug: true,
      playground: false,
      autoSchemaFile: 'schema.gql',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
