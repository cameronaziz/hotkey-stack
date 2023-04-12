import { API } from './GithubAPI';

namespace Project {
  export type WebhookPayload = typeof import('@actions/github').context.payload
  export type Github = ReturnType<typeof import('@actions/github').getOctokit>

  type OwnerType = 'organization' | 'user'

  export type ProjectInfo = {
    projectNodeId?: string
    status?: API.ProjectField
    ownerType: OwnerType
    ownerName: string
    projectNumber: number
  }

}

export default Project
