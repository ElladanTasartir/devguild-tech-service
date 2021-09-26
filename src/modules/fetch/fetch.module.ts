import { Module } from '@nestjs/common';
import { FetchGithubService } from './fetch-github.service';
import { FetchUserService } from './fetch-user.service';

@Module({
  providers: [FetchGithubService, FetchUserService],
  exports: [FetchGithubService, FetchUserService],
})
export class FetchModule {}
