import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { userServiceURL } from 'src/config';
import { User } from '../technology/interfaces/user';
import { UsersTechnologies } from '../technology/interfaces/users-technologies.interface';

@Injectable()
export class FetchUserService {
  private httpService: AxiosInstance;

  constructor() {
    this.httpService = axios.create({
      baseURL: userServiceURL,
    });
  }

  async updateUserInfo(id: string, user: Partial<User>): Promise<void> {
    await this.httpService.put(`/users/${id}`, user);
  }

  async insertTechnologiesInUser(
    id: string,
    usersTechnologies: UsersTechnologies,
  ): Promise<UsersTechnologies> {
    const { data } = await this.httpService.post<UsersTechnologies>(
      `/users/${id}/techs`,
      usersTechnologies,
    );

    return data;
  }
}
