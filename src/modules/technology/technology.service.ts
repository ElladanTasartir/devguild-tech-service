import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchGithubService } from '../fetch/fetch-github.service';
import { Technology } from './entities/technology.entity';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    private readonly fetchGithubService: FetchGithubService,
  ) {}

  async getTechnology(id: number): Promise<Technology> {
    const technology = await this.technologyRepository.findOne(id);

    if (!technology) {
      throw new NotFoundException(`Technology with ID "${id} does not exist"`);
    }

    return technology;
  }

  getTechnologies(): Promise<Technology[]> {
    return this.technologyRepository.find();
  }

  async processUserTechnologies(github_id: number) {
    const userRepositories = await this.fetchGithubService.getUserRepositories(
      github_id,
    );

    const technologiesArray = [
      ...new Set(
        userRepositories
          .map((repository) => repository.language)
          .filter(Boolean),
      ),
    ];

    console.log(technologiesArray);
  }
}
