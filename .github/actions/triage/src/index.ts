import { debug } from '@actions/core'
import triage from './triage'

(async () => {
	debug('Triage is Running')
	await triage()
})()
