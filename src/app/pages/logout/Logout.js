import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import AuthService from "../../../_reactivestack/auth.service";

class Logout extends Component {

	componentDidMount() {
		AuthService.logout();
		setTimeout(() => {
			this.props.history.push("/");
			window.location.reload();
		}, 1000);
	}

	render() {
		return (
			<div>
				<p>Logging out...</p>
			</div>
		);
	}
}

export default withRouter(Logout);
