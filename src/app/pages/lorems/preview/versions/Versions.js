import _ from "lodash";
import React from "react";

import PreviewVersionsRow from "./Row.js";
import {useSelector} from "react-redux";

const PreviewVersions = () => {

	const store = useSelector(store => store);

	let selectedVersions = store.lorems.selectedVersions;
	if (_.isEmpty(selectedVersions)) {
		return (
			<span><i className="fa fa-refresh fa-spin"/> Loading versions...</span>
		);
	}

	return (
		<table width="100%" border="1" cellSpacing="0" cellPadding="10">
			<thead>
			<tr>
				<th align="left">V.</th>
				<th align="left">Rating</th>
				<th align="left">Created At</th>
			</tr>
			</thead>

			<tbody>
			<PreviewVersionsRow/>
			</tbody>
		</table>
	);

};

export default PreviewVersions;
