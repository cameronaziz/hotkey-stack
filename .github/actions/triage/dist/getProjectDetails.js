"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
/* global WebhookPayloadPullRequest, GitHub */
/**
 * Get Information about a project board.
 *
 * @param {GitHub} octokit          - Initialized Octokit REST client.
 * @param {string} projectBoardLink - The link to the project board.
 * @returns {Promise<Object>} - Project board information.
 */
const getProjectDetails = async (octokit, projectBoardLink) => {
    const projectRegex = /^(?:https:\/\/)?github\.com\/(?<ownerType>orgs|users)\/(?<ownerName>[^/]+)\/projects\/(?<projectNumber>\d+)/;
    const matches = projectBoardLink.match(projectRegex);
    if (!matches) {
        (0, core_1.debug)(`Triage: Invalid project board link provided. Cannot triage to a board`);
        return null;
    }
    const { groups } = matches;
    if (!groups) {
        return null;
    }
    const { ownerType, ownerName, projectNumber } = groups;
    const projectInfo = {
        ownerType: ownerType === 'orgs' ? 'organization' : 'user',
        ownerName,
        projectNumber: parseInt(projectNumber, 10),
        projectNodeId: undefined,
        status: undefined,
    };
    // First, use the GraphQL API to request the project's node ID,
    // as well as info about the first 20 fields for that project.
    const projectDetails = await octokit.graphql(`query getProject($ownerName: String!, $projectNumber: Int!) {
			${projectInfo.ownerType}(login: $ownerName) {
				projectV2(number: $projectNumber) {
					id
					fields(first:20) {
						nodes {
							... on ProjectV2Field {
								id
								name
							}
							... on ProjectV2SingleSelectField {
								id
								name
								options {
									id
									name
								}
							}
						}
					}
				}
			}
		}`, {
        ownerName: projectInfo.ownerName,
        projectNumber: projectInfo.projectNumber,
    });
    // Extract the project node ID.
    const projectNodeId = projectDetails[projectInfo.ownerType]?.projectV2.id;
    if (projectNodeId) {
        projectInfo.projectNodeId = projectNodeId; // Project board node ID. String.
    }
    // Extract the ID of the Status field.
    const statusField = projectDetails[projectInfo.ownerType]?.projectV2.fields.nodes.find(field => field.name === 'Status');
    if (statusField) {
        projectInfo.status = statusField; // Info about our status column (id as well as possible values).
    }
    return projectInfo;
};
exports.default = getProjectDetails;
