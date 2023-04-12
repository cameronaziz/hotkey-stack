import { debug, getInput } from '@actions/core'
import getSectionValue from './getSectionValue'

const ASSOCIATED_PROJECT = 'Associated Project'

const handleAssociatedProject = (oneLineBody: string) => {
  const associatedProject = getSectionValue(oneLineBody, ASSOCIATED_PROJECT)

  debug(associatedProject)
}


export default handleAssociatedProject
