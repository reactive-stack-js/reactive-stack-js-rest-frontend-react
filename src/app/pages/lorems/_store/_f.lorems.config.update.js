import _ from 'lodash';

import ClientSocket from "../../../../util/client.socket";

const _initialConfig = () => ({
	page: 1,
	pageSize: 10,
	search: '',
	sort: {createdAt: -1}
});

const STRING_COLUMNS = ['firstname', 'lastname', 'email', 'description'];
const NUMBER_COLUMNS = ['iteration', 'rating'];

const loremsConfigUpdate = (config) => {
	if (!config) config = _initialConfig();

	let query = {isLatest: true};
	let search = config.search;
	if (!_.isEmpty(search)) {
		let or = _.map(STRING_COLUMNS, (column) => {
			let q = {};
			_.set(q, column, {$regex: search});
			return q;
		});
		if (!isNaN(search)) {
			let number = _.toInteger(search);
			let numberOr = _.map(NUMBER_COLUMNS, (column) => {
				let q = {};
				_.set(q, column, number);
				return q;
			});
			or = _.concat(or, numberOr);
		}

		query = {
			isLatest: true,
			$or: or
		};
	}

	ClientSocket.send({
		type: 'subscribe',
		target: 'lorems',
		observe: 'lorems',
		scope: 'many',
		config: {
			query,
			sort: config.sort,
			page: config.page,
			pageSize: config.pageSize
		}
	});
};
export default loremsConfigUpdate;
