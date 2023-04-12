import { debug, getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import getSectionValue from './getSectionValue'

const ASSOCIATED_PROJECT = 'Associated Project'

const split = (associatedProject: string | string[], splitter: string | string[]) => {
  const projects = Array.isArray(associatedProject) ? associatedProject : [associatedProject]
  const splitters = Array.isArray(splitter) ? splitter : [splitter]
  return projects.flatMap(
    (project) => splitters
      .flatMap((splitBy) => {
        if (project.includes(splitBy)) {
          return project
            .split(splitBy)
            .map((item) => item.trim().replace('#', ''))
            
        }
        return null
      })
      .filter((item): item is string => !!item)
  )
}

const parseProject = (associatedProject: string) => {
  // Split by `:` `;` `-` and `:`.
  const splits = [':', ';', '-', ',']
  return split(associatedProject, splits)
}

const handleAssociatedProject = async (oneLineBody: string) => {
  const { issue, repository } = context.payload

  const githubToken = getInput('github_token')
  const associatedProject = getSectionValue(oneLineBody, ASSOCIATED_PROJECT)
  if (!associatedProject) {
    return
  }

  const projects = parseProject(associatedProject)

  if (projects.length > 0 || !repository) {
    return
  }
  const { owner, name } = repository

  const octokit = getOctokit(githubToken)

  projects.forEach(async (project) => {
    const issue_number = parseInt(project)
    const other = await octokit.rest.issues.get({
      owner: owner.login,
      issue_number,
      repo: name
    })

    debug(other.data.body || 'no body')
  })

}


export default handleAssociatedProject
