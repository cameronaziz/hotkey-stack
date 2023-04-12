import { debug } from '@actions/core'
import API from '../../typings/GithubAPI'
import Project from '../../typings/Project'
/**
 * Add PR to our project board.
 *
 * @param {GitHub} octokit     - Initialized Octokit REST client.
 * @param {Object} projectInfo - Info about our project board.
 * @param {string} node_id     - The node_id of the Pull Request.
 * @returns {Promise<string>} - Info about the project item id that was created.
 */
const addPRToBoard = async (octokit: Project.Github, projectInfo: Project.ProjectInfo, id: string): Promise<string> => {
	const { projectNodeId } = projectInfo

	// Add our PR to that project board.
	const projectItemDetails = await octokit.graphql<API.AddIssueToProjectMutation>(
		`mutation addIssueToProject($input: AddProjectV2ItemByIdInput!) {
			addProjectV2ItemById(input: $input) {
				item {
					id
				}
			}
		}`,
		{
			input: {
				projectId: projectNodeId,
				contentId: id,
			},
		}
	)

	const projectItemId = projectItemDetails.addProjectV2ItemById.item.id
	if (!projectItemId) {
		debug(`Triage: Failed to add PR to project board.`)
		return ''
	}

	debug(`Triage: Added PR to project board.`)

	return projectItemId
}

export default addPRToBoard
