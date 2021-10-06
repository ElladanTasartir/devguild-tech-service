import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { ProcessTechnologyPayload } from './interfaces/process-technology.interface';
import { User } from './interfaces/user';
import { TechnologyService } from './technology.service';

@Controller()
export class TechnologyController {
  private logger = new Logger('ProcessUserTechnologies');
  constructor(private readonly technologyService: TechnologyService) {}

  @EventPattern('process-technologies')
  async processUserTechnologies(
    @Payload() processTechnology: ProcessTechnologyPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel: Channel = context.getChannelRef();
    const message = context.getMessage() as Message;
    const { id } = processTechnology;

    try {
      const technologies = await this.technologyService.processUserTechnologies(
        processTechnology,
      );

      this.logger.verbose(
        `Technologies "${technologies}"" were inserted into user "${id}"`,
      );

      return channel.ack(message);
    } catch (err) {
      if (err?.isAxiosError) {
        this.logger.warn(`
          There was an error sending the request to devguild-user-service,
        `);
        this.logger.warn(JSON.stringify(err.response.data));

        return channel.ack(message);
      }

      this.logger.error(
        `There was an internal error while processing users technologies`,
      );
      this.logger.error(JSON.stringify(err));
      return channel.nack(message);
    }
  }

  @EventPattern('process-user')
  async processUserInfo(@Payload() user: User, @Ctx() context: RmqContext) {
    const channel: Channel = context.getChannelRef();
    const message = context.getMessage() as Message;

    try {
      await this.technologyService.processUserInfo(user);
    } catch (err) {
      if (err?.isAxiosError) {
        this.logger.warn(`
          There was an error sending the request to devguild-user-service,
        `);
        this.logger.warn(JSON.stringify(err.response.data));

        return channel.ack(message);
      }

      this.logger.error(
        `There was an internal error while processing users technologies`,
      );
      this.logger.error(JSON.stringify(err));
      return channel.nack(message);
    }
  }
}
