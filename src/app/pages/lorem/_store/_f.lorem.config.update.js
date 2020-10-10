import ClientSocket from "../../../../util/client.socket";

const _initialConfig = () => ({_id: null});

const loremConfigUpdate = (config) => {
	if (!config) config = _initialConfig();

	ClientSocket.send({
		type: "subscribe",
		target: "lorem",
		observe: "lorems",
		scope: "one",
		config: {
			query: config
		}
	});
};
export default loremConfigUpdate;
