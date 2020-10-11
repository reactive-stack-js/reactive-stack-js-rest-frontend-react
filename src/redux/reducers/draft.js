import {isError, isFSA} from "flux-standard-action";
import {SET_DRAFT} from "../actions/draft";

export default function (state = [], action) {
	if (!isFSA(action)) return state;
	if (isError(action)) {
		// todo: handle error
		return state;
	}

	switch (action.type) {
		case SET_DRAFT:
			return action.payload;

		default:
			return state;
	}
}