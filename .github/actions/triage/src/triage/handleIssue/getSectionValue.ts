import { debug, getInput } from '@actions/core'

const getSectionValue = (oneLineBody: string, title: string) => {
  const sectionTitle = `### ${title}`
  console.log(sectionTitle)
  const index = oneLineBody.lastIndexOf(sectionTitle)
  console.log(index)
  debug(`${index}`)
  console.log(oneLineBody)
  if (index < 0) {
    return null
  }
  const sectionStartIndex = index + sectionTitle.length
  const remainingText = oneLineBody.substring(sectionStartIndex)
  const nextSection = remainingText.indexOf('###')
  console.log('nextSection', nextSection)
  const nextSectionIndex = nextSection < 0 ? undefined : nextSection
  console.log('nextSectionIndex', nextSectionIndex)
  const text = remainingText.substring(0, nextSectionIndex)
  console.log('text', text)
  return text
}

export default getSectionValue
