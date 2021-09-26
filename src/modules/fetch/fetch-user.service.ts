import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { userServiceURL } from 'src/config';
import { UsersTechnologies } from '../technology/interfaces/users-technologies.interface';

@Injectable()
export class FetchUserService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: userServiceURL,
    });
  }

  async insertTechnologiesInUser(
    id: string,
    usersTechnologies: UsersTechnologies,
  ): Promise<UsersTechnologies> {
    const { data } = await this.client.post<UsersTechnologies>(
      `/users/${id}/techs`,
      usersTechnologies,
    );

    return data;
  }
}
