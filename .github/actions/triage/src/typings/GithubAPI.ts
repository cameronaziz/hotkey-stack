namespace API {
  export type SetStatusMutation = {
    set_status: SetStatus
  }

  export type AddIssueToProjectMutation = {
    addProjectV2ItemById: AddProjectV2ItemById
  }

  export type SelectField = {
    id: string
    name: string
    options: SelectFieldOption[]
  }

  export type ProjectField = Field | SelectField

  export type GetProjectQuery = {
    [ownerType in string]?: Owner
  }

  type ProjectV2Item = {
    id: string
  }

  type SetStatus = {
    projectV2Item: ProjectV2Item
  }

  type AddProjectV2ItemByIdItem = {
    id: string
  }

  type AddProjectV2ItemById = {
    item: AddProjectV2ItemByIdItem
  }

  type Field = {
    id: string
    name: string
  }

  type SelectFieldOption = {
    id: string
    name: string
  }

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
}

export default API
