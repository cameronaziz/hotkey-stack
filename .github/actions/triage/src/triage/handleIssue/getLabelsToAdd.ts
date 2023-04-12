const DEFAULT_LABELS = ['Issue Triaged']
const SEVERITY = '### Severity'
const SCALE = '### Scale'

const getSSS = (body: string) => {
  const oneLine = body.replace(/(\r\n|\n|\r)/gm, '')
  const severityIndex = oneLine.lastIndexOf(SEVERITY) + SEVERITY.length
  const severity = oneLine.substring(severityIndex, severityIndex + 2)
  const scaleIndex = oneLine.lastIndexOf(SCALE) + SCALE.length
  const scale = oneLine.substring(scaleIndex, scaleIndex + 2)

  return [
    severity,
    scale,
  ].filter((item) => !!item)
}
const getLabelsToAdd = (body: string) => {
  const labels = [...DEFAULT_LABELS, ...getSSS(body)]
  return labels
}

export default getLabelsToAdd
