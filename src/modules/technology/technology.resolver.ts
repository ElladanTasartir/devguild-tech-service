import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Technology } from './entities/technology.entity';
import { TechnologyService } from './technology.service';

@Resolver(() => Technology)
export class TechnologyResolver {
  constructor(private readonly technologyService: TechnologyService) {}

  @Query(() => [Technology], { name: 'technologies' })
  getTechnologies(
    @Args('ids', { type: () => [Int], nullable: true })
    ids: number[],
  ): Promise<Technology[]> {
    return this.technologyService.getTechnologies(ids);
  }

  @Query(() => Technology, { name: 'technology' })
  async getTechnology(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Technology> {
    return this.technologyService.getTechnology(id);
  }
}
