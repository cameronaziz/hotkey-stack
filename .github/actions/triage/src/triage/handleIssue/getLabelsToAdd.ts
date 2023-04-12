import getSectionValue from './getSectionValue'

const DEFAULT_LABELS = ['Issue Triaged']
const SEVERITY = 'Severity'
const SCALE = 'Scale'

const getLabelsToAdd = (oneLineBody: string) => {
  const labels = [...DEFAULT_LABELS]
  
  const severity = getSectionValue(oneLineBody, SEVERITY)
  console.log(severity)
  if (severity) {
    labels.push(severity)
  }

  const scale = getSectionValue(oneLineBody, SCALE)
  if (scale) {
    labels.push(scale)
  }
  
  return labels
}

export default getLabelsToAdd
