import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FetchModule } from '../fetch/fetch.module';
import { Technology } from './entities/technology.entity';
import { TechnologyController } from './technology.controller';
import { TechnologyResolver } from './technology.resolver';
import { TechnologyService } from './technology.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technology]), FetchModule],
  controllers: [TechnologyController],
  providers: [TechnologyResolver, TechnologyService],
})
export class TechnologyModule {}
