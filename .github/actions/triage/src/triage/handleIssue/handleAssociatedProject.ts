import { debug, getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import getSectionValue, { oneLine } from './getSectionValue'

const ASSOCIATED_PROJECT = 'Associated Project'
const CHILD_ISSUES = 'Child Issues'

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

const parseProject = (associatedProject: string | null) => {
  if (associatedProject === null) {
    return []
  }
  // Split by `:` `;` `-` and `:`.
  const splits = [':', ';', '-', ',']
  return split(associatedProject.trim(), splits)
}

const createChildIssue = (issue: number) => `### ${CHILD_ISSUES}\n\n#${issue}`

const getNextBody = (currentBody: string, issueNumber: number) => {
  const sectionTitle = `### ${CHILD_ISSUES}`
  const oneLineBody = oneLine(currentBody)
  const current = getSectionValue(oneLineBody, CHILD_ISSUES)

  
  if (currentBody.includes(sectionTitle)) {
    const index = currentBody.lastIndexOf(sectionTitle)
    const sectionStartIndex = index + sectionTitle.length
    const remainingText = currentBody.substring(sectionStartIndex)
    const nextSectionIndex = remainingText.indexOf('###')
    const projects = parseProject(current)
    projects.push(`#${issueNumber}`)
    const result = projects.join(', ')
    const remaining = nextSectionIndex < 0 ? '' : remainingText.substring(nextSectionIndex)
    return `${currentBody.substring(0, sectionStartIndex)}\n${result}${remaining}`
  }
  
  return `${currentBody}\n\n${createChildIssue(issueNumber)}}`


}

const handleAssociatedProject = async (oneLineBody: string, issueNumber: number) => {
  const { repository } = context.payload

  const githubToken = getInput('github_token')
  if (!repository) {
    return
  }

  const associatedProject = getSectionValue(oneLineBody, ASSOCIATED_PROJECT)
  const projects = parseProject(associatedProject)

  if (projects.length === 0) {
    return
  }

  const { owner, name } = repository
  const octokit = getOctokit(githubToken)
  console.log('projects', console.log(projects))
  projects.forEach(async (project) => {
    const issue_number = parseInt(project)
    try {
      const other = await octokit.rest.issues.get({
        owner: owner.login,
        issue_number,
        repo: name
      })
      const currentBody = other.data.body || ''
      const nextBody = getNextBody(currentBody, issueNumber)
      await octokit.rest.issues.update({
        owner: owner.login,
        issue_number,
        repo: name,
        body: nextBody,
      })

    } catch {
      debug(`Issue ${issue_number} was not found.`)
    }

  })

}


export default handleAssociatedProject
