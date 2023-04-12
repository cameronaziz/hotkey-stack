export const oneLine = (content: string): string => content.replace(/(\r\n|\n|\r)/gm, '')

const getSectionValue = (oneLineBody: string, title: string) => {
  const sectionTitle = `### ${title}`
  const index = oneLineBody.lastIndexOf(sectionTitle)
  if (index < 0) {
    return null
  }
  const sectionStartIndex = index + sectionTitle.length
  const remainingText = oneLineBody.substring(sectionStartIndex)
  const nextSection = remainingText.indexOf('###')
  const nextSectionIndex = nextSection < 0 ? undefined : nextSection
  const text = remainingText.substring(0, nextSectionIndex)
  return text
}

export default getSectionValue
