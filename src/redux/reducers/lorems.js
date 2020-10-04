import {isError, isFSA} from 'flux-standard-action';
import {
	SET_LOREMS,
	SET_LOREMS_TOTAL_COUNT,
	SET_SELECTED_LOREM,
	SET_SELECTED_LOREM_VERSIONS
} from '../actions/lorems';

export default function (state = [], action) {
	if (!isFSA(action)) return state;
	if (isError(action)) {
		// todo: handle error
		return state;
	}

	switch (action.type) {
		case SET_LOREMS:
			return Object.assign({}, state, {
				list: action.payload
			});

		case SET_LOREMS_TOTAL_COUNT:
			return Object.assign({}, state, {
				totalCount: action.payload
			});

		case SET_SELECTED_LOREM:
			return Object.assign({}, state, {
				selected: action.payload
			});

		case SET_SELECTED_LOREM_VERSIONS:
			return Object.assign({}, state, {
				selectedVersions: action.payload
			});

		default:
			return state;
	}
}