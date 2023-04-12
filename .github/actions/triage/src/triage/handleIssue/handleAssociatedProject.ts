import { debug, getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import getSectionValue, { oneLine } from './getSectionValue'

const ASSOCIATED_PROJECT = 'Associated Project'
const CHILD_ISSUES = 'Child Issues'
const SPLITS = [':', ';', '-', ',']

const split = (associatedProject: string | string[]) => {
  const projects = Array.isArray(associatedProject) ? associatedProject : [associatedProject]
  return projects.flatMap(
    (project) => SPLITS
      .flatMap((split) => {
        if (project.includes(split)) {
          return project
            .split(split)
            .map((item) => item.trim())

        }
        return project.trim()
      })
      .filter((item): item is string => !!item)
  )

  
  
}

const onlyUnique = <T>(value:T, index: number, array: T[]) => array.indexOf(value) === index

const parseProject = (associatedProject: string | null) => {
  if (associatedProject === null) {
    return []
  }
  // Split by `:` `;` `-` and `:`.
  
  return split(associatedProject.trim()).filter(onlyUnique)
}

const addProject = (issueNumber: number, currentValue: string | null) => {
  if (!currentValue) {
    return `#${issueNumber}`
  }

  const currentProjects = parseProject(currentValue)
  const current = currentProjects.length === 0 ? '' : currentProjects.join(', ')
  return `#${issueNumber}, ${current}`
  
}

const createChildIssue = (issue: number) => `### ${CHILD_ISSUES}\n\n#${issue}`

const getNextBody = (currentBody: string, issueNumber: number) => {
  const sectionTitle = `### ${CHILD_ISSUES}`
  const oneLineBody = oneLine(currentBody)
  const currentValue = getSectionValue(oneLineBody, CHILD_ISSUES)

  
  if (currentBody.includes(sectionTitle)) {
    const index = currentBody.lastIndexOf(sectionTitle)
    const sectionStartIndex = index + sectionTitle.length
    const remainingText = currentBody.substring(sectionStartIndex)
    const nextSectionIndex = remainingText.indexOf('###')
    const projects = addProject(issueNumber, currentValue)
    console.log(projects)
    const remaining = nextSectionIndex < 0 ? '' : remainingText.substring(nextSectionIndex)
    return `${currentBody.substring(0, sectionStartIndex)}\n${projects}${remaining}`
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
