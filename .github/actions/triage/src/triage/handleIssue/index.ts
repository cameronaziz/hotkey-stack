import { debug, getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import Project from '../../typings/Project'
import getLabelsToAdd from './getLabelsToAdd'
import { oneLine } from './getSectionValue'
import handleAssociatedProject from './handleAssociatedProject'

const logIssue = (payload: Project.WebhookPayload, githubToken: string) => {
  const { issue, repository } = payload
  if (!issue) {
    debug('No Issue in context')
    return
  }
  if (!issue.body) {
    debug('No Issue Body in context')
    return
  }
  if (!repository) {
    debug('No Repository in context')
    return
  }
  if (!githubToken) {
    debug('No github_token')
    return
  }

  debug('Handle Issue Setup Failed')
}

const handleIssue = async () => {
  const githubToken = getInput('github_token')
  debug('Handling Issue')
  const { issue, repository } = context.payload
  
  if (!issue || !issue.body || !repository || !githubToken || githubToken === '') {
    logIssue(context.payload, githubToken)
    return
  }
  
  const { owner, name } = repository
  const { number, body } = issue
  const oneLineBody = oneLine(body)
  const labels = getLabelsToAdd(oneLineBody)
  handleAssociatedProject(oneLineBody)
  
  const labelsText = labels.map((label) => `"${label}"`).join(', ')
  debug(`Adding the following labels to issue #${number}: ${labelsText}`)
  
  const octokit = getOctokit(githubToken)
  await octokit.rest.issues.addLabels({
    owner: owner.login,
    repo: name,
    issue_number: number,
    labels,
  })
}

export default handleIssue
