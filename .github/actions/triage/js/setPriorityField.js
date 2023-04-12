"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const isSelectField = (field) => Array.isArray(field.options);
/**
 * Set custom fields for a project item.
 *
 * @param {GitHub} octokit       - Initialized Octokit REST client.
 * @param {Object} projectInfo   - Info about our project board.
 * @param {string} projectItemId - The ID of the project item.
 * @param {string} statusText    - Status of our PR (must match an existing column in the project board).
 * @returns {Promise<string>} - The new project item id.
 */
const setPriorityField = async (octokit, projectInfo, projectItemId, statusText) => {
    const { projectNodeId, // Project board node ID.
    status, } = projectInfo;
    if (!status || !isSelectField(status)) {
        return '';
    }
    const { id: statusFieldId, // ID of the status field.
    options, } = status;
    // Find the ID of the status option that matches our PR status.
    const statusOptionId = options.find(option => option.name === statusText)?.id;
    if (!statusOptionId) {
        (0, core_1.debug)(`Triage: Status ${statusText} does not exist as a colunm option in the project board.`);
        return '';
    }
    const projectNewItemDetails = await octokit.graphql(`mutation ( $input: UpdateProjectV2ItemFieldValueInput! ) {
			set_status: updateProjectV2ItemFieldValue( input: $input ) {
				projectV2Item {
					id
				}
			}
		}`, {
        input: {
            projectId: projectNodeId,
            itemId: projectItemId,
            fieldId: statusFieldId,
            value: {
                singleSelectOptionId: statusOptionId,
            },
        },
    });
    const newProjectItemId = projectNewItemDetails.set_status.projectV2Item.id;
    if (!newProjectItemId) {
        (0, core_1.debug)(`Triage: Failed to set the "${statusText}" status for this project item.`);
        return '';
    }
    (0, core_1.debug)(`Triage: Project item ${newProjectItemId} was moved to "${statusText}" status.`);
    return newProjectItemId; // New Project item ID (what we just edited). String.
};
exports.default = setPriorityField;
