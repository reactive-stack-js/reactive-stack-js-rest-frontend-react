import ClientSocket from "../../../../_reactivestack/client.socket";

const _initialConfig = () => ({_id: null});

const loremConfigUpdate = (config) => {
	if (!config) config = _initialConfig();

	ClientSocket.sendSubscribe({
		target: "draft",
		observe: "drafts",
		scope: "one",
		config: {
			query: config
		}
	});
};
export default loremConfigUpdate;
