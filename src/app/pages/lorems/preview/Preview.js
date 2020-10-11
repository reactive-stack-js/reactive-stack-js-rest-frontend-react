import _ from "lodash";
import moment from "moment";

import React from "react";
import {useHistory} from "react-router-dom";
import {connect, useSelector} from "react-redux";

import "./Preview.css";
import PreviewVersions from "./versions/Versions.js";
import {sendFetchGet} from "@/_reactivestack/_f.send.fetch";

const Preview = () => {
	const history = useHistory();

	const _editLorem = async (lorem) => {
		const draftId = sendFetchGet("/api/draft/create/lorems/" + lorem._id);
		history.push("/lorem/" + draftId);
	};

	const store = useSelector(store => store);

	let selected = store.lorems.selected;
	if (_.isEmpty(selected)) return ("");

	return (
		<div id="lorems-preview-component">
			<div id="lorems-preview-edit">
				<button className="edit" onClick={() => _editLorem(selected)}>Edit</button>
			</div>

			<div id="lorems-preview-content">
				<p><label className="preview-label">Version:</label> {selected.iteration}</p>
				<p><label className="preview-label">Name:</label> {selected.firstname} {selected.lastname}</p>
				<p><label className="preview-label">Username:</label> {selected.username}</p>
				<p><label className="preview-label">Email:</label> {selected.email}</p>
				<p><label className="preview-label">Rating:</label> {selected.rating}</p>
				<p><label className="preview-label">Spieces:</label> {selected.species}</p>
				<p><label className="preview-label">Created&nbsp;At:</label> {moment(selected.createdAt).format("YYYY/MM/DD HH:mm:ss")}</p>
				<p><label className="preview-label">Description:</label></p>
				<div>{selected.description}<br/>&nbsp;</div>
			</div>

			<div id="lorems-preview-grid">
				<PreviewVersions/>
			</div>
		</div>
	)
};

export default connect()(Preview);
