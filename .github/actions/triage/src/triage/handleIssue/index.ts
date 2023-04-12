import { debug, getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { WebhookPayload } from 'types'
import getLabelsToAdd from './getLabelsToAdd'

const logIssue = (payload: WebhookPayload, githubToken: string) => {
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
const SEVERITY = '### Severity'
const SCALE = '### Scale'

const getSSS = (body: string) => {
  const oneLine = body.replace(/(\r\n|\n|\r)/gm, '')
  const severityIndex = oneLine.lastIndexOf(SEVERITY) + SEVERITY.length
  const severity = oneLine.substring(severityIndex, severityIndex + 2)
  const scaleIndex = oneLine.lastIndexOf(SCALE) + SCALE.length
  const scale = oneLine.substring(scaleIndex, scaleIndex + 2)

  return {
    severity,
    scale,
  }
}

const handleIssue = async () => {
  const githubToken = getInput('github_token')
  const { issue, repository } = context.payload
  
  if (!issue || !issue.body || !repository || !githubToken || githubToken === '') {
    logIssue(context.payload, githubToken)
    return
  }
  
  const { owner, name } = repository
  const { number, body } = issue
  const labels = getLabelsToAdd(body)

  const { severity, scale } = getSSS(body)

  debug(severity)
  debug(scale)
  
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
