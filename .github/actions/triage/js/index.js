"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const defineProperty_1 = __importDefault(require("./defineProperty"));
const triagePRToProject_1 = __importDefault(require("./triagePRToProject"));
(async function main() {
    (0, core_1.debug)('Our action is running');
    const token = (0, core_1.getInput)('github_token');
    if (!token) {
        (0, core_1.setFailed)('Input `github_token` is required');
        return;
    }
    // Get the Octokit client.
    const octokit = (0, github_1.getOctokit)(token);
    // Get info about the event.
    const { payload, eventName } = github_1.context;
    (0, core_1.debug)(`Received event = '${eventName}', action = '${payload.action}'`);
    // Let's monitor changes to Pull Requests.
    const projectToken = (0, core_1.getInput)('triage_projects_token');
    if (eventName === 'pull_request_target' && projectToken !== '') {
        (0, core_1.debug)(`Triage: now processing a change to a Pull Request`);
        // For this task, we need octokit to have extra permissions not provided by the default GitHub token.
        // Let's create a new octokit instance using our own custom token.
        const projectOctokit = (0, github_1.getOctokit)(projectToken);
        await (0, triagePRToProject_1.default)(payload, projectOctokit);
    }
    // We only want to proceed if this is a newly opened issue.
    if (eventName === 'issues' && payload.action === 'opened') {
        // Extra data from the event, to use in API requests.
        const { issue, repository } = payload;
        if (!issue || !repository) {
            return;
        }
        const { owner, name } = repository;
        const { number, body } = issue;
        if (!body) {
            return;
        }
        // List of labels to add to the issue.
        const labels = ['Issue triaged'];
        // Look for priority indicators in body.
        const priorityRegex = /###\sSeverity\n\n(?<severity>.*)\n\n###\sAvailable\sworkarounds\?\n\n(?<workaround>.*)\n/gm;
        let match;
        while ((match = priorityRegex.exec(body))) {
            const [, severity = '', workaround = ''] = match;
            const priorityLabel = (0, defineProperty_1.default)(severity, workaround);
            if (priorityLabel !== '') {
                labels.push(priorityLabel);
            }
        }
        (0, core_1.debug)(`Add the following labels to issue #${number}: ${labels
            .map((label) => `"${label}"`)
            .join(', ')}`);
        // Finally make the API request.
        await octokit.rest.issues.addLabels({
            owner: owner.login,
            repo: name,
            issue_number: number,
            labels,
        });
    }
})();
