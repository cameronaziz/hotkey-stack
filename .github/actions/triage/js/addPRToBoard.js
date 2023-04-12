"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
/**
 * Add PR to our project board.
 *
 * @param {GitHub} octokit     - Initialized Octokit REST client.
 * @param {Object} projectInfo - Info about our project board.
 * @param {string} node_id     - The node_id of the Pull Request.
 * @returns {Promise<string>} - Info about the project item id that was created.
 */
const addPRToBoard = async (octokit, projectInfo, node_id) => {
    const { projectNodeId } = projectInfo;
    // Add our PR to that project board.
    const projectItemDetails = await octokit.graphql(`mutation addIssueToProject($input: AddProjectV2ItemByIdInput!) {
			addProjectV2ItemById(input: $input) {
				item {
					id
				}
			}
		}`, {
        input: {
            projectId: projectNodeId,
            contentId: node_id,
        },
    });
    const projectItemId = projectItemDetails.addProjectV2ItemById.item.id;
    if (!projectItemId) {
        (0, core_1.debug)(`Triage: Failed to add PR to project board.`);
        return '';
    }
    (0, core_1.debug)(`Triage: Added PR to project board.`);
    return projectItemId;
};
exports.default = addPRToBoard;
