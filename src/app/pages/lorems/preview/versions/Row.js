import _ from "lodash";
import moment from "moment";

import React from "react";
import {useSelector} from "react-redux";

import store from "../../../../../redux/store";
import {setSelectedLorem} from "../../../../../redux/actions/all";
import ClientSocket from "../../../../../_reactivestack/client.socket";

const _selectRow = (lorem) => {
	store.dispatch(setSelectedLorem(lorem));   // optimistic update !!!

	ClientSocket.send({
		type: "subscribe",
		target: "selected",
		observe: "lorems",
		scope: "one",
		config: {
			query: {_id: lorem._id}
		}
	});
};

const PreviewVersionsRow = () => {

	const store = useSelector(store => store);
	let selected = store.lorems.selected;
	let selectedVersions = store.lorems.selectedVersions;
	if (_.isEmpty(selectedVersions)) return ("");

	return selectedVersions.map((lorem) => {
		let rowClass = selected && lorem._id === selected._id ? "active" : "";
		return (
			<tr key={Math.random()} className={rowClass} onClick={() => _selectRow(lorem)}>
				<td>{lorem.iteration}</td>
				<td>{lorem.rating}</td>
				<td>{moment(lorem.createdAt).format("YYYY/MM/DD HH:mm:ss")}</td>
			</tr>
		);
	});
};

export default PreviewVersionsRow;
