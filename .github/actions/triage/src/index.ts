import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import definePriority from './defineProperty';
import { debug } from './log';
import triagePrToProject from './triagePRToProject';


(async function main() {
	const github_token: string = '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';
	debug('Our action is running', true);

	const token = github_token
	if (!token) {
		setFailed('Input `github_token` is required');
		return;
	}

	// Get the Octokit client.
	const octokit = getOctokit(token);

	// Get info about the event.
	const { payload, eventName } = context;

	debug(`Received event = '${eventName}', action = '${payload.action}'`, true);

	// Let's monitor changes to Pull Requests.
	const projectToken = github_token

	if (eventName === 'pull_request_target' && projectToken !== '') {
		debug(`Triage: now processing a change to a Pull Request`);

		// For this task, we need octokit to have extra permissions not provided by the default GitHub token.
		// Let's create a new octokit instance using our own custom token.
		const projectOctokit = getOctokit(projectToken);
		await triagePrToProject(payload, projectOctokit);
	}

	// We only want to proceed if this is a newly opened issue.
	if (eventName === 'issues') {
		// Extra data from the event, to use in API requests.
		const { issue, repository } = payload;

		if (!issue || !repository) {
			return
		}

		const { owner, name } = repository
		const { number, body } = issue

		if (!body) {
			return
		}

		// List of labels to add to the issue.
		const labels = [ 'Issue triaged' ];

		// Look for priority indicators in body.
		const priorityRegex = /###\sSeverity\n\n(?<severity>.*)\n\n###\sAvailable\sworkarounds\?\n\n(?<workaround>.*)\n/gm;
		let match;
		while ((match = priorityRegex.exec(body))) {
			const [ , severity = '', workaround = '' ] = match;

			const priorityLabel = definePriority(severity, workaround);
			if (priorityLabel !== '') {
				labels.push(priorityLabel);
			}
		}

		debug(
			`Add the following labels to issue #${ number }: ${ labels
				.map((label) => `"${ label }"`)
				.join(', ') }`
		);

		// Finally make the API request.
		await octokit.rest.issues.addLabels({
			owner: owner.login,
			repo: name,
			issue_number: number,
			labels,
		});
	}
})();
