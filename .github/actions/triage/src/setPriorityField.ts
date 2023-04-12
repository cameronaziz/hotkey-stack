import { debug, } from '@actions/core';
import { ProjectField, SelectField, SetStatusMutation } from './api';
import { Github, ProjectInfo } from './types';

const isSelectField = (field: ProjectField): field is SelectField =>
	Array.isArray((field as SelectField).options)

/**
 * Set custom fields for a project item.
 *
 * @param {GitHub} octokit       - Initialized Octokit REST client.
 * @param {Object} projectInfo   - Info about our project board.
 * @param {string} projectItemId - The ID of the project item.
 * @param {string} statusText    - Status of our PR (must match an existing column in the project board).
 * @returns {Promise<string>} - The new project item id.
 */
const setPriorityField = async (octokit: Github, projectInfo: ProjectInfo, projectItemId: string, statusText: string): Promise<string> => {
	const {
		projectNodeId, // Project board node ID.
		status,
	} = projectInfo;

	if (!status || !isSelectField(status)) {
		return ''
	}
	const {
		id: statusFieldId, // ID of the status field.
		options,
	} = status

	// Find the ID of the status option that matches our PR status.
	const statusOptionId = options.find(option => option.name === statusText)?.id;
	if (!statusOptionId) {
		debug(
			`Triage: Status ${ statusText } does not exist as a colunm option in the project board.`
		);
		return '';
	}

	const projectNewItemDetails = await octokit.graphql<SetStatusMutation>(
		`mutation ( $input: UpdateProjectV2ItemFieldValueInput! ) {
			set_status: updateProjectV2ItemFieldValue( input: $input ) {
				projectV2Item {
					id
				}
			}
		}`,
		{
			input: {
				projectId: projectNodeId,
				itemId: projectItemId,
				fieldId: statusFieldId,
				value: {
					singleSelectOptionId: statusOptionId,
				},
			},
		}
	);

	const newProjectItemId = projectNewItemDetails.set_status.projectV2Item.id;

	if (!newProjectItemId) {
		debug( `Triage: Failed to set the "${ statusText }" status for this project item.` );
		return '';
	}

	debug( `Triage: Project item ${ newProjectItemId } was moved to "${ statusText }" status.` );

	return newProjectItemId; // New Project item ID (what we just edited). String.
}

export default setPriorityField
