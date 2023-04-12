"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const addPRToBoard_1 = __importDefault(require("./addPRToBoard"));
const getProjectDetails_1 = __importDefault(require("./getProjectDetails"));
const setPriorityField_1 = __importDefault(require("./setPriorityField"));
/**
 * Handle automatic triage of Pull Requests into a Github Project board.
 *
 * @param {WebhookPayloadPullRequest} payload - The payload from the Github Action.
 * @param {GitHub}                    octokit - Initialized Octokit REST client.
 * @returns {Promise<void>}
 */
const triagePrToProject = async (payload, octokit) => {
    // Extra data from the event, to use in API requests.
    const { pull_request } = payload;
    if (!pull_request) {
        return;
    }
    const { number, draft, node_id } = pull_request;
    const isDraft = !!draft;
    const projectBoardLink = (0, core_1.getInput)('triage_projects_board');
    if (!projectBoardLink) {
        (0, core_1.setFailed)('Triage: No project board link provided. Cannot triage to a board');
        return;
    }
    // Get details about our project board, to use in our requests.
    const projectInfo = await (0, getProjectDetails_1.default)(octokit, projectBoardLink);
    if (!projectInfo || !projectInfo.projectNodeId) {
        (0, core_1.setFailed)('Triage: we cannot fetch info about our project board. Cannot triage to a board');
        return;
    }
    // Add our Pull Request to the project board.
    const projectItemId = await (0, addPRToBoard_1.default)(octokit, projectInfo, node_id);
    if (!projectItemId) {
        (0, core_1.setFailed)('Triage: failed to add PR to project board');
        return;
    }
    // If we have no info about the status column, stop.
    if (!projectInfo.status) {
        (0, core_1.debug)(`Triage: No status column found in project board.`);
        return;
    }
    // If a PR is opened but not ready for review yet, add it to the In Progress column.
    if (isDraft) {
        (0, core_1.debug)(`Triage: Pull Request #${number} is a draft. Add it to the In Progress column.`);
        await (0, setPriorityField_1.default)(octokit, projectInfo, projectItemId, 'In Progress');
        return;
    }
    // If the PR is ready for review, let's add it to the Needs Review column.
    (0, core_1.debug)(`Triage: Pull Request #${number} is ready for review. Add it to the Needs Review column.`);
    await (0, setPriorityField_1.default)(octokit, projectInfo, projectItemId, 'Needs Review');
    return;
};
exports.default = triagePrToProject;
