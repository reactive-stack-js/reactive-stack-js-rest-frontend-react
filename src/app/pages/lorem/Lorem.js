import React, {useEffect} from "react";
import {useHistory, withRouter} from "react-router-dom";
import {connect, useSelector, useDispatch} from "react-redux";

import _ from "lodash";
import moment from "moment";

import AuthService from "../../../_reactivestack/auth.service";
import ClientSocket from "../../../_reactivestack/client.socket";

import "./Lorem.css";

import LoremUpdater from "./_store/lorem.updater";
import {setLorem} from "../../../redux/actions/all";
import loremConfigUpdate from "./_store/_f.lorem.config.update";

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
				loremConfigUpdate({_id: params.match.params.loremId});
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

	let lorem = store.lorem;
	if (!lorem) {
		// history.push("");
		return ("...I got nothing...");
	}

	const isDisabled = (fieldName) => {
		if (lorem) {
			let meta = lorem.meta;
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
		fetch("/api/draft/focus/" + lorem._id, {
			method: "POST",
			headers: AuthService.getAuthHeader(),
			body: JSON.stringify({field})
		});
	}

	const onBlur = async (field) => {
		fetch("/api/draft/blur/" + lorem._id, {
			method: "POST",
			headers: AuthService.getAuthHeader(),
			body: JSON.stringify({field})
		});
	}

	const onChange = async (value, field) => {
		_.set(lorem, field, value);
		dispatch(setLorem(_.cloneDeep(lorem)));

		fetch("/api/draft/change/" + lorem._id, {
			method: "POST",
			headers: AuthService.getAuthHeader(),
			body: JSON.stringify({value, field})
		});
	}

	const closeDialog = async () => {
		const response = await fetch("/api/draft/cancel/" + lorem._id, {
			method: "POST",
			headers: AuthService.getAuthHeader(),
			body: JSON.stringify({})
		});
		const completed = await response.json();
		if (completed) history.push("");
		else console.error(" - closeDialog response", completed);  	// oops...
	};

	const saveLorem = async () => {
		const response = await fetch("/api/draft/save/", {
			method: "POST",
			headers: AuthService.getAuthHeader(),
			body: JSON.stringify({document: lorem})
		});
		const completed = await response.json();
		if (completed) history.push("");
		else console.error(" - saveLorem response", completed);	// oops...
	};

	const renderSelectOptions = () => {
		return SPECIES.map((species) => {
			return (<option key={Math.random()} value={species}>{species}</option>);
		});
	}

	const renderUpdatedAt = () => {
		let updatedAt = _.get(lorem, "updatedAt");
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
								<input className="editorField" type="text" value={lorem.firstname || ""} disabled={isDisabled("firstname")} onFocus={() => onFocus("firstname")} onBlur={() => onBlur("firstname")} onChange={(e) => onChange(e.target.value, "firstname")}/>
								&nbsp;
								<input className="editorField" type="text" value={lorem.lastname || ""} disabled={isDisabled("lastname")} onFocus={() => onFocus("lastname")} onBlur={() => onBlur("lastname")} onChange={(e) => onChange(e.target.value, "lastname")}/>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>E-mail:</label></td>
							<td>
								<input className="editorField" type="text" value={lorem.email || ""} disabled={isDisabled("email")} onFocus={() => onFocus("email")} onBlur={() => onBlur("email")} onChange={(e) => onChange(e.target.value, "email")}/>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>Species:</label>{lorem.species}</td>
							<td>
								<select className="editorField"
										value={lorem.species}
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
								<input className="editorField" type="number" value={lorem.rating || 0} disabled={isDisabled("rating")} onFocus={() => onFocus("rating")} onBlur={() => onBlur("rating")} onChange={(e) => onChange(e.target.value, "rating")}/>
							</td>
						</tr>
						<tr>
							<td className="editorRow"><label>Description:</label></td>
							<td>
									<textarea style={{
										width: "413px",
										height: "150px"
									}}
											  value={lorem.description || ""}
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
					<b>{moment(lorem.createdAt).format("YYYY/MM/DD HH:mm:ss")}</b>
					&nbsp;
					using
					<b>version {lorem.iteration}</b> of <b>{lorem.username}</b>.
					{renderUpdatedAt(lorem)}
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
