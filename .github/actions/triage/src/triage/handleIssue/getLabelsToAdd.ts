import definePriority from './defineProperty'

const DEFAULT_LABELS = ['Issue Triaged']

const getLabelsToAdd = (body: string) => {
  const labels = [...DEFAULT_LABELS]
  const priorityRegex = /###\sSeverity\n\n(?<severity>.*)\n\n###\sAvailable\sworkarounds\?\n\n(?<workaround>.*)\n/gm

  let match
  while ((match = priorityRegex.exec(body))) {
    const [, severity = '', workaround = '' ] = match

    const priorityLabel = definePriority(severity, workaround)
    if (priorityLabel !== '') {
      labels.push(priorityLabel)
    }
  }

  return labels
}

export default getLabelsToAdd
