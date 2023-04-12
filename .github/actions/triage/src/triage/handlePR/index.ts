import { debug, getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import triagePrToProject from './triagePRToProject'

const handlePR = async () => {
  const projectsToken = getInput('projects_token')

  if (!projectsToken || projectsToken === '') {
    return
  }

  const { payload } = context

  debug(`Triage: now processing a change to a Pull Request`)
  const projectOctokit = getOctokit(projectsToken)
  await triagePrToProject(payload, projectOctokit)
}

export default handlePR
