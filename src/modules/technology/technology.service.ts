import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { In, Repository } from 'typeorm';
import { FetchGithubService } from '../fetch/fetch-github.service';
import { FetchUserService } from '../fetch/fetch-user.service';
import { Technology } from './entities/technology.entity';
import { CreateTechnologyInput } from './inputs/create-technology.input';
import { ProcessTechnologyPayload } from './interfaces/process-technology.interface';
import { User } from './interfaces/user';

const requiredFields = [
  'bio',
  'location',
  'following',
  'followers',
  'login',
  'avatar_url',
];

@Injectable()
export class TechnologyService {
  private logger = new Logger('ProcessUserInfo');

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

  getTechnologies(ids: number[]): Promise<Technology[]> {
    if (ids && ids.length) {
      return this.technologyRepository.find({
        where: {
          id: In(ids),
        },
        order: {
          name: 'ASC',
        },
      });
    }

    return this.technologyRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async createTechnology(
    createTechnologyInput: CreateTechnologyInput,
  ): Promise<Technology> {
    const { name } = createTechnologyInput;

    const foundTechnology = await this.technologyRepository.findOne({
      where: {
        name,
      },
    });

    if (foundTechnology) {
      throw new UnprocessableEntityException(
        `Technology with name "${name}" already exists`,
      );
    }

    const createdTechnology = this.technologyRepository.create(
      createTechnologyInput,
    );

    return this.technologyRepository.save(createdTechnology);
  }

  async processUserInfo(user: User): Promise<void> {
    const { id, github_id } = user;

    const createdDateTimeRange = dayjs(user.created_at).add(2, 'minutes');

    const updatedTime = dayjs(user.updated_at);

    const updatedTimeIsInTimeRange = updatedTime.isBefore(createdDateTimeRange);

    const yesterday = dayjs(Date.now()).subtract(1, 'day').endOf('day');

    if (!(updatedTimeIsInTimeRange || updatedTime.isBefore(yesterday))) {
      this.logger.verbose(`User has already been updated today`);
      return;
    }

    const githubUser = await this.fetchGithubService.getUserInfo(github_id);

    const fieldsToUpdate = {};

    for (const field of requiredFields) {
      if (user[field] !== githubUser[field]) {
        fieldsToUpdate[field] = githubUser[field];
      }
    }

    await this.fetchUserService.updateUserInfo(id, {
      ...fieldsToUpdate,
      updated_at: new Date(Date.now()),
    });

    await this.processUserTechnologies({
      id,
      github_id,
    });

    this.logger.verbose(`User "${user.id}" has been updated`);
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
