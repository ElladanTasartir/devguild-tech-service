import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { githubAPIUrl } from '../../config';

interface UserRepositories {
  id: number;
  name: string;
  language: string;
}

interface GithubUser {
  login: string;
  avatar_url: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
}

@Injectable()
export class FetchGithubService {
  private httpService: AxiosInstance;

  constructor() {
    this.httpService = axios.create({
      baseURL: githubAPIUrl,
    });
  }

  async getUserInfo(id: number): Promise<GithubUser> {
    const { data } = await this.httpService.get<GithubUser>(`/user/${id}`);

    return data;
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
