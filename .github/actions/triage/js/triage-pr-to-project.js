"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { setFailed, getInput, debug } = require('@actions/core');
const get_project_details_1 = __importDefault(require("./get-project-details"));
/* global WebhookPayloadPullRequest, GitHub */
/**
 * Set custom fields for a project item.
 *
 * @param {GitHub} octokit       - Initialized Octokit REST client.
 * @param {Object} projectInfo   - Info about our project board.
 * @param {string} projectItemId - The ID of the project item.
 * @param {string} statusText    - Status of our PR (must match an existing column in the project board).
 * @returns {Promise<string>} - The new project item id.
 */
async function setPriorityField(octokit, projectInfo, projectItemId, statusText) {
    const { projectNodeId, // Project board node ID.
    status: { id: statusFieldId, // ID of the status field.
    options, }, } = projectInfo;
    // Find the ID of the status option that matches our PR status.
    const statusOptionId = options.find(option => option.name === statusText).id;
    if (!statusOptionId) {
        debug(`Triage: Status ${statusText} does not exist as a colunm option in the project board.`);
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
        debug(`Triage: Failed to set the "${statusText}" status for this project item.`);
        return '';
    }
    debug(`Triage: Project item ${newProjectItemId} was moved to "${statusText}" status.`);
    return newProjectItemId; // New Project item ID (what we just edited). String.
}
/**
 * Add PR to our project board.
 *
 * @param {GitHub} octokit     - Initialized Octokit REST client.
 * @param {Object} projectInfo - Info about our project board.
 * @param {string} node_id     - The node_id of the Pull Request.
 * @returns {Promise<string>} - Info about the project item id that was created.
 */
async function addPrToBoard(octokit, projectInfo, node_id) {
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
        debug(`Triage: Failed to add PR to project board.`);
        return '';
    }
    debug(`Triage: Added PR to project board.`);
    return projectItemId;
}
/**
 * Handle automatic triage of Pull Requests into a Github Project board.
 *
 * @param {WebhookPayloadPullRequest} payload - The payload from the Github Action.
 * @param {GitHub}                    octokit - Initialized Octokit REST client.
 * @returns {Promise<void>}
 */
async function triagePrToProject(payload, octokit) {
    // Extra data from the event, to use in API requests.
    const { pull_request: { number, draft, node_id }, } = payload;
    const isDraft = !!draft;
    const projectBoardLink = getInput('triage_projects_board');
    if (!projectBoardLink) {
        setFailed('Triage: No project board link provided. Cannot triage to a board');
        return;
    }
    // Get details about our project board, to use in our requests.
    const projectInfo = await (0, get_project_details_1.default)(octokit, projectBoardLink);
    if (Object.keys(projectInfo).length === 0 || !projectInfo.projectNodeId) {
        setFailed('Triage: we cannot fetch info about our project board. Cannot triage to a board');
        return;
    }
    // Add our Pull Request to the project board.
    const projectItemId = await addPrToBoard(octokit, projectInfo, node_id);
    if (!projectItemId) {
        setFailed('Triage: failed to add PR to project board');
        return;
    }
    // If we have no info about the status column, stop.
    if (!projectInfo.status) {
        debug(`Triage: No status column found in project board.`);
        return;
    }
    // If a PR is opened but not ready for review yet, add it to the In Progress column.
    if (isDraft) {
        debug(`Triage: Pull Request #${number} is a draft. Add it to the In Progress column.`);
        await setPriorityField(octokit, projectInfo, projectItemId, 'In Progress');
        return;
    }
    // If the PR is ready for review, let's add it to the Needs Review column.
    debug(`Triage: Pull Request #${number} is ready for review. Add it to the Needs Review column.`);
    await setPriorityField(octokit, projectInfo, projectItemId, 'Needs Review');
    return;
}
module.exports = triagePrToProject;
