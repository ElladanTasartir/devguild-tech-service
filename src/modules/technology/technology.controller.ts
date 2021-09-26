import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProcessTechnologyPayload } from './interfaces/process-technology.interface';
import { TechnologyService } from './technology.service';

@Controller()
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @EventPattern('process-technologies')
  async processUserTechnologies(
    @Payload() processTechnology: ProcessTechnologyPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.technologyService.processUserTechnologies(
      processTechnology.github_id,
    );
  }
}
