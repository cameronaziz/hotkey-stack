/**
 * Determine the priority of the issue based on severity and workarounds info from the issue contents.
 * This uses the priority matrix defined in this post: https://jeremy.hu/github-actions-build-javascript-action-part-2/
 *
 * @param {string} severity - How many users are impacted by the problem.
 * @param {string} workaround - Are there any available workarounds for the problem.
 * @returns {string} Priority of issue. High, Medium, Low, or empty string.
 */
const definePriority = ( severity = '', workaround = '' ) => {
	const labels = {
		high: '🏔 High',
		medium: '🏕 Medium',
		low: '🏝 Low',
	};
	const { high, medium, low } = labels;

	if ( workaround === 'No and the platform is unusable' ) {
		return severity === 'One' ? medium : high;
	} else if ( workaround === 'No but the platform is still usable' ) {
		return medium;
	} else if ( workaround !== '' && workaround !== '_No response_' ) { // "_No response_" is the default value.
		return severity === 'All' || severity === 'Most (> 50%)' ? medium : low;
	}

	// Fallback.
	return '';
}

export default definePriority
