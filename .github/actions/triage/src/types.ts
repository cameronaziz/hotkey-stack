import { context, getOctokit } from "@actions/github";
import { ProjectField } from "./api";

export type WebhookPayload = typeof context.payload
export type Github = ReturnType<typeof getOctokit>

type OwnerType = 'organization' | 'user'

export type ProjectInfo = {
  projectNodeId?: string
  status?: ProjectField
  ownerType: OwnerType
  ownerName: string
  projectNumber: number
}
