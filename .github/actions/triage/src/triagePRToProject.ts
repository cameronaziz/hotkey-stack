import { debug, getInput, setFailed } from '@actions/core';
import addPRToBoard from './addPRToBoard';
import getProjectDetails from './getProjectDetails';
import setPriorityField from './setPriorityField';
import { Github, WebhookPayload } from './types';

/**
 * Handle automatic triage of Pull Requests into a Github Project board.
 *
 * @param {WebhookPayloadPullRequest} payload - The payload from the Github Action.
 * @param {GitHub}                    octokit - Initialized Octokit REST client.
 * @returns {Promise<void>}
 */
const triagePrToProject = async(payload: WebhookPayload, octokit: Github)  => {
	// Extra data from the event, to use in API requests.
	const { pull_request } = payload;
	if(!pull_request) {
		return
	}
	
	const { number, draft, node_id } = pull_request
	const isDraft = !! draft;

	const projectBoardLink = 'https://github.com/users/cameronaziz/projects/10'
	if (!projectBoardLink) {
		setFailed('Triage: No project board link provided. Cannot triage to a board');
		return;
	}

	// Get details about our project board, to use in our requests.
	const projectInfo = await getProjectDetails(octokit, projectBoardLink);
	if (!projectInfo || ! projectInfo.projectNodeId) {
		setFailed('Triage: we cannot fetch info about our project board. Cannot triage to a board');
		return;
	}

	// Add our Pull Request to the project board.
	const projectItemId = await addPRToBoard(octokit, projectInfo, node_id);
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
		debug(`Triage: Pull Request #${ number } is a draft. Add it to the In Progress column.`);
		await setPriorityField(octokit, projectInfo, projectItemId, 'In Progress');
		return;
	}

	// If the PR is ready for review, let's add it to the Needs Review column.
	debug(
		`Triage: Pull Request #${ number } is ready for review. Add it to the Needs Review column.`
	);
	await setPriorityField(octokit, projectInfo, projectItemId, 'Needs Review');
	return;
}

export default triagePrToProject
