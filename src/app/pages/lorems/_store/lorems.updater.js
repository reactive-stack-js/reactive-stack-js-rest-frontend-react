import store from "../../../../redux/store";

import {
	setLorems,
	setLoremsTotalCount,
	setSelectedLorem,
	setSelectedLoremVersions
} from "../../../../redux/actions/all";

import _ from "lodash";
import {filter} from "rxjs/operators";

import ClientSocket from "../../../../_reactivestack/client.socket";

const VALID_TARGETS = ["lorems", "selected", "selectedVersions"];

export default class LoremsUpdater {

	destroy() {
		this._subscription.unsubscribe();
		this._subscription = null;
		console.log("LoremsUpdater destroyed.");
	}

	constructor() {
		this._init()
			.then(() => console.log("LoremsUpdater initialized."))
			.catch((err) => console.error("LoremsUpdater initialization error", err));
	}

	_subscription;

	async _init() {
		let clientSocket = await ClientSocket.init();
		this._subscription = clientSocket
			.pipe(filter((message) => {
				let {type, target} = message;
				return "update" === type && _.includes(VALID_TARGETS, target);
			}))
			.subscribe({
				next: (message) => this._process(message),
				error: (err) => console.log("error", err),
				complete: () => console.log("completed")
			});
	}

	_process(message) {
		let {target, payload} = message;

		switch (target) {
			case "lorems":
				store.dispatch(setLorems(payload.lorems));
				store.dispatch(setLoremsTotalCount(payload._loremsCount));
				break;

			case "selected":
				store.dispatch(setSelectedLorem(payload.selected));
				break;

			case "selectedVersions":
				store.dispatch(setSelectedLoremVersions(payload.selectedVersions));
				break;

			default:
				break;
		}
	}

}
