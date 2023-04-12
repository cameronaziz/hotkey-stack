const getSectionValue = (oneLineBody: string, title: string) => {
  const sectionTitle = `### ${title}`
  const sectionStartIndex = oneLineBody.lastIndexOf(sectionTitle) + sectionTitle.length
  const remainingText = oneLineBody.substring(sectionStartIndex)
  const nextSection = remainingText.indexOf('###')
  const nextSectionIndex = nextSection < 0 ? undefined : nextSection
  const text = remainingText.substring(0, nextSectionIndex)
  return text
}

export default getSectionValue
