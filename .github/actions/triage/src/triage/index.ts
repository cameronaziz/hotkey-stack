import { context } from '@actions/github'
import handleIssue from './handleIssue'
import handlePR from './handlePR'

const triage = async () => {
	const { eventName } = context

	switch (eventName) {
		case 'pull_request_target':
      await handlePR()
			break
		case 'issues':
			await handleIssue()
			break
		default:
			break
	}
}

export default triage
