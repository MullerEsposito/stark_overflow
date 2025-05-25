import axios from "axios"
import { components } from '@octokit/openapi-types'

export const gitHubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'X-Github-Api-Version': '2022-11-28',
    'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  }
});

export const getContributors = async () => {
  const response = await gitHubApi.get<Contributor[]>(`/repos/mulleresposito/stark_overflow/contributors`)
  return response.data
}

export const getUserInfo = async (username: string) => {
  const response = await gitHubApi.get<GitHubUser>(`https://api.github.com/users/${username}`)
  return response.data
}

export  const getUserSocialAccounts = async (username: string) => {
  const response = await gitHubApi.get<SocialAccount[]>(`https://api.github.com/users/${username}/social_accounts`)
  return response.data
}


export type Contributor = components['schemas']['contributor']
export type GitHubUser = components["schemas"]["public-user"]
export type SocialAccount = components["schemas"]["social-account"]
export type Collaborator = {
  id: number
  name: string
  avatar: string
  socials: {
    provider: string;
    url: string;
  }[]
}