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
  private httpService: AxiosInstance;

  constructor() {
    this.httpService = axios.create({
      baseURL: githubAPIUrl,
    });
  }

  async getUserRepositories(id: number): Promise<UserRepositories[]> {
    const { data } = await this.httpService.get<UserRepositories[]>(
      `/user/${id}/repos`,
      {
        params: {
          per_page: 100,
        },
      },
    );

    return data;
  }
}
