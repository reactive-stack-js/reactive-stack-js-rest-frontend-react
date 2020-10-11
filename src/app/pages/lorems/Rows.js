import _ from "lodash";
import moment from "moment";

import React from "react";
import {useSelector} from "react-redux";

import store from "../../../redux/store";
import ClientSocket from "../../../_reactivestack/client.socket";
import {setSelectedLorem, setSelectedLoremVersions} from "../../../redux/actions/all";

const _selectRow = (selected, lorem) => {
	if (selected && lorem.itemId === selected.itemId) {
		store.dispatch(setSelectedLorem({}));
		store.dispatch(setSelectedLoremVersions([]));

		ClientSocket.send({type: "unsubscribe", target: "selected"});
		ClientSocket.send({type: "unsubscribe", target: "selectedVersions"});

	} else {
		store.dispatch(setSelectedLorem(lorem));				// optimistic update
		store.dispatch(setSelectedLoremVersions([]));	// cleanup

		ClientSocket.send({
			type: "subscribe",
			target: "selected",
			observe: "lorems",
			scope: "one",
			config: {
				query: {
					itemId: lorem.itemId,
					isLatest: true
				}
			}
		});

		ClientSocket.send({
			type: "subscribe",
			target: "selectedVersions",
			observe: "lorems",
			scope: "many",
			config: {
				query: {
					itemId: lorem.itemId
				},
				sort: {iteration: -1}
			}
		});
	}
};

const LoremsRows = ({page, pageSize}) => {

	const store = useSelector(store => store);

	let list = store.lorems.list;
	if (_.isEmpty(list)) return ("");

	let rowId = (page - 1) * pageSize + 1;
	_.each(list, (m) => m.rowId = rowId++);

	return list.map((lorem) => {
		let selected = store.lorems.selected;
		let rowClass = selected && lorem.itemId === selected.itemId ? "active" : "";

		return (
			<tr key={Math.random()} className={rowClass} onClick={() => _selectRow(selected, lorem)}>
				<td>{lorem.rowId}</td>
				<td>{lorem.iteration}</td>
				<td>{lorem.firstname} {lorem.lastname}</td>
				<td>{lorem.username}</td>
				<td>{lorem.email}</td>
				<td>{lorem.rating}</td>
				<td>{lorem.species}</td>
				<td>
					{_.truncate(lorem.description, {
						"length": 75,
						"separator": " "
					})}
				</td>
				<td>{moment(lorem.createdAt).format("YYYY/MM/DD HH:mm:ss")}</td>
			</tr>
		);
	});
};

export default LoremsRows;
