import { Module } from '@nestjs/common';
import { FetchGithubService } from './fetch-github.service';

@Module({
  providers: [FetchGithubService],
  exports: [FetchGithubService],
})
export class FetchModule {}
