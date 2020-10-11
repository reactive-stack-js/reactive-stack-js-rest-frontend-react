import {filter} from "rxjs/operators";

import store from "../../../../redux/store";
import {setDraft} from "../../../../redux/actions/all";

import ClientSocket from "../../../../_reactivestack/client.socket";

export default class LoremUpdater {
	_subscription;

	destroy() {
		this._subscription.unsubscribe();
		this._subscription = null;
		console.log("LoremUpdater destroyed.");
	}

	constructor() {
		this._init()
			.then(() => console.log("LoremUpdater initialized."))
			.catch((err) => console.error("LoremUpdater initialization error", err));
	}

	async _init() {
		let clientSocket = await ClientSocket.init();
		this._subscription = clientSocket
			.pipe(filter((message) => {
				let {type, path} = message;
				return "update" === type && "draft" === path;
			}))
			.subscribe({
				next: (message) => this._process(message),
				error: (err) => console.log("error", err),
				complete: () => console.log("completed")
			});
	}

	_process(message) {
		let {path, payload} = message;

		switch (path) {
			case "draft":
				store.dispatch(setDraft(payload.draft));
				break;

			default:
				break;
		}
	}

}
