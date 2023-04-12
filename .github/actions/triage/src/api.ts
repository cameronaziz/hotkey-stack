type ProjectV2Item = {
  id: string
}

type SetStatus = {
  projectV2Item: ProjectV2Item
}

export type SetStatusMutation = {
  set_status: SetStatus
}

type AddProjectV2ItemByIdItem = {
  id: string
}

type AddProjectV2ItemById = {
  item: AddProjectV2ItemByIdItem
}

export type AddIssueToProjectMutation = {
  addProjectV2ItemById: AddProjectV2ItemById
}

type Field = {
  id: string
  name: string
}

type SelectFieldOption = {
  id: string
  name: string
}

export type SelectField = {
  id: string
  name: string
  options: SelectFieldOption[]
}

export type ProjectField = Field | SelectField

type Fields = {
  nodes: ProjectField[]
}

type ProjectV2 = {
  id: string
  fields: Fields
}

type Owner = {
  projectV2: ProjectV2
}

export type GetProjectQuery = {
  [ownerType in string]?: Owner
}
