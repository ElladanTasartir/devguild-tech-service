import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { githubAPIUrl } from 'src/config';

interface UserRepositories {
  id: number;
  name: string;
  language: string;
}

@Injectable()
export class FetchGithubService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: githubAPIUrl,
    });
  }

  async getUserRepositories(id: number): Promise<UserRepositories[]> {
    const { data } = await this.client.get<UserRepositories[]>(
      `/user/${id}/repos`,
    );

    return data;
  }
}
