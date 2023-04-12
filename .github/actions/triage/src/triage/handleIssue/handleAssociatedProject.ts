import { debug } from '@actions/core'
import getSectionValue from './getSectionValue'

const ASSOCIATED_PROJECT = 'Associated Project'

const split = (associatedProject: string | string[], splitter: string | string[]) => {
  const projects = Array.isArray(associatedProject) ? associatedProject : [associatedProject]
  const splitters = Array.isArray(splitter) ? splitter : [splitter]
  return projects.flatMap((project) => splitters.flatMap((splitBy) => project.split(splitBy)))
}

const parseProject = (associatedProject: string) => {
  // Split by `:` `;` `-` and `:`.
  const splits = [':', ';', '-', ':']
  return split(associatedProject, splits)
}

const handleAssociatedProject = (oneLineBody: string) => {
  const associatedProject = getSectionValue(oneLineBody, ASSOCIATED_PROJECT)
  if (!associatedProject) {
    return
  }
  const proejects = parseProject(associatedProject)
  debug(proejects.map((proeject) => `______${proeject}______`).join('      '))

  debug(associatedProject)
}


export default handleAssociatedProject
