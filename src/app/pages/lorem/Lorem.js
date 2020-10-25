import React, {useEffect} from "react";
import {useHistory, withRouter} from "react-router-dom";
import {connect, useSelector, useDispatch} from "react-redux";

import _ from "lodash";
import moment from "moment";

import AuthService from "../../../_reactivestack/auth.service";
import ClientSocket from "../../../_reactivestack/client.socket";

import "./Lorem.css";

import LoremUpdater from "./_store/lorem.updater";
import {setDraft} from "../../../redux/actions/all";
import loremConfigUpdate from "./_store/_f.lorem.config.update";
import {sendGet, sendPost} from "../../../_reactivestack/_f.send.fetch";

// let INITIAL;
// const _cleanDiff = (diff) => _.omit(diff, [
// 	"_id", "isLatest",
// 	"meta", "meta__added",
// 	"updatedAt", "updatedAt__added",
// 	"updatedBy", "updatedBy__added"
// ]);

const SPECIES = ["Human", "Draenei", "Dryad", "Dwarf", "Gnome", "Worgde"];

const Lorem = (params) => {

	let updater;

	useEffect(() => {
		let init = async () => {
			await ClientSocket.location();
			if (AuthService.loggedIn()) {
				updater = new LoremUpdater();
				loremConfigUpdate({_id: params.match.params.draftId});
			}
		};
		init();

		return () => {
			if (updater) updater.destroy();
			updater = null;
		};
	}, []);

	const history = useHistory();
	const dispatch = useDispatch();
	const store = useSelector(store => store);

	if (!AuthService.loggedIn()) {
		return (
			<p style={{padding: 20}}>Sorry, you have to sign in to see the data.</p>
		)
	}

	let draft = store.draft;
	if (!draft || !_.get(draft, 'document', false)) {
		// history.push("");
		return (<p>...I got nothing...</p>);
	}

	const isDisabled = (fieldName) => {
		if (draft) {
			let meta = draft.meta;
			if (meta) {
				let field = _.get(meta, fieldName);
				if (field) {
					let user = _.get(field, "user");
					return user !== AuthService.user().id ? "disabled" : "";
				}
			}
		}
		return "";
	}

	const onFocus = async (field) => {
		if (isDisabled(field)) return;
		sendPost("/api/draft/focus/" + draft._id, {field});
	}

	const onBlur = async (field) => {
		sendPost("/api/draft/blur/" + draft._id, {field});
	}

	const onChange = async (value, field) => {
		_.set(draft.document, field, value);
		dispatch(setDraft(_.cloneDeep(draft)));
		sendPost("/api/draft/change/" + draft._id, {value, field});
	}

	const closeDialog = async () => {
		await sendGet("/api/draft/cancel/" + draft._id);
		// TODO: remove this and observe the data change!
		history.push("");
	};

	const saveLorem = async () => {
		await sendGet("/api/draft/save/" + draft._id);
		// TODO: remove this and observe the data change!
		history.push("");
	};

	const renderSelectOptions = () => {
		return SPECIES.map((species) => {
			return (<option key={Math.random()} value={species}>{species}</option>);
		});
	}

	const renderUpdatedAt = () => {
		let updatedAt = _.get(draft, "updatedAt");
		if (!updatedAt) return ("");
		return (<span><br/>Last update at <b>{moment(updatedAt).format("YYYY/MM/DD HH:mm:ss")}</b>.</span>);
	}

	return (
		<div id="lorem-component">
			<div id="lorem-form">
				<form className="form">
					<table width="100%" cellSpacing="0" cellPadding="10">
						<tbody>
						<tr>
							<td width="60" className="editorRow"><label>Name:</label></td>
							<td style={{whiteSpace: "nowrap"}}>
								<input className="editorField" type="text" value={draft.document.firstname || ""} disabled={isDisabled("firstname")} onFocus={() => onFocus("firstname")} onBlur={() => onBlur("firstname")} onChange={(e) => onChange(e.target.value, "firstname")}/>
								&nbsp;
								<input className="editorField" type="text" value={draft.document.lastname || ""} disabled={isDisabled("lastname")} onFocus={() => onFocus("lastname")} onBlur={() => onBlur("lastname")} onChange={(e) => onChange(e.target.value, "lastname")}/>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>E-mail:</label></td>
							<td>
								<input className="editorField" type="text" value={draft.document.email || ""} disabled={isDisabled("email")} onFocus={() => onFocus("email")} onBlur={() => onBlur("email")} onChange={(e) => onChange(e.target.value, "email")}/>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>Species:</label>{draft.document.species}</td>
							<td>
								<select className="editorField"
										value={draft.document.species}
										disabled={isDisabled("species")}
										onFocus={() => onFocus("species")}
										onBlur={() => onBlur("species")}
										onChange={(e) => onChange(e.target.value, "species")}>
									{renderSelectOptions()}
								</select>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>Rating:</label></td>
							<td>
								<input className="editorField" type="number" value={draft.document.rating || 0} disabled={isDisabled("rating")} onFocus={() => onFocus("rating")} onBlur={() => onBlur("rating")} onChange={(e) => onChange(e.target.value, "rating")}/>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>Description:</label></td>
							<td>
									<textarea style={{
										width: "413px",
										height: "150px"
									}}
											  value={draft.document.description || ""}
											  disabled={isDisabled("description")}
											  onFocus={() => onFocus("description")}
											  onBlur={() => onBlur("description")}
											  onChange={(e) => onChange(e.target.value, "description")}/>
							</td>
						</tr>
						</tbody>
					</table>
				</form>
			</div>

			<div id="lorem-meta">
				<p align="right">
					Draft created on
					<b>{moment(draft.document.createdAt).format("YYYY/MM/DD HH:mm:ss")}</b>
					&nbsp;
					using
					<b>version {draft.document.iteration}</b> of <b>{draft.document.username}</b>.
					{renderUpdatedAt(draft)}
				</p>
			</div>

			<div id="lorem-controls">
				<button onClick={() => closeDialog()}>Close</button>
				&nbsp;&nbsp;
				<button onClick={() => saveLorem()}>Save</button>
			</div>
		</div>
	);
}

export default withRouter(connect()(Lorem));
