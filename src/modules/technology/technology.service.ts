import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FetchGithubService } from '../fetch/fetch-github.service';
import { FetchUserService } from '../fetch/fetch-user.service';
import { Technology } from './entities/technology.entity';
import { ProcessTechnologyPayload } from './interfaces/process-technology.interface';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    private readonly fetchGithubService: FetchGithubService,
    private readonly fetchUserService: FetchUserService,
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

  async processUserTechnologies(
    processTechnologyPayload: ProcessTechnologyPayload,
  ): Promise<string[]> {
    const { github_id, id } = processTechnologyPayload;

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

    const technologiesThatAlreadyExist = await this.technologyRepository.find({
      where: {
        name: In(technologiesArray),
      },
    });

    const technologiesThatAlreadyExistNames = technologiesThatAlreadyExist.map(
      (tech) => tech.name,
    );

    const technologiesToInsert = technologiesArray
      .filter(
        (technology) => !technologiesThatAlreadyExistNames.includes(technology),
      )
      .map((technology) => ({
        name: technology,
      }));

    const insertedTechnologies = await this.technologyRepository.insert(
      technologiesToInsert,
    );

    const technologiesIds = [
      ...technologiesThatAlreadyExist.map((tech) => ({
        technology_id: tech.id,
      })),
      ...insertedTechnologies.identifiers.map((identifier) => ({
        technology_id: identifier.id,
      })),
    ];

    await this.fetchUserService.insertTechnologiesInUser(id, {
      technologies: technologiesIds,
    });

    return technologiesArray;
  }
}
