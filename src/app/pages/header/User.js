import _ from "lodash";
import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Button, Icon} from "semantic-ui-react";

import "./User.css";
import AuthService from "../../../_reactivestack/auth.service";

class User extends Component {

	facebook = () => this.props.history.push("/login/facebook");
	google = () => this.props.history.push("/login/google");

	componentDidUpdate() {
		if (this.props.location.pathname === "/") return;
		if (_.startsWith(this.props.location.pathname, "/login")) return;
		localStorage.setItem("initialPageRequest", this.props.location.pathname);
	}

	render() {

		if (AuthService.loggedIn()) {
			const user = AuthService.user();
			const provider = _.toLower(_.first(_.words(_.get(user, "provider", ""))));
			const providerId = _.toLower(_.first(_.words(_.get(user, "providerId", ""))));
			return (
				<span>
					{provider}_{providerId} <Link to="/logout" className="logout">logout</Link>
				</span>
			);
		}

		return (
			<div id="user-component">
				<Button color="blue" className="FacebookButton" onClick={this.facebook}>
					<Icon className="facebook f icon"></Icon> Login
				</Button>

				<Button color="red" className="GoogleButton" onClick={this.google}>
					<Icon className="google icon"></Icon> Login
				</Button>
			</div>
		);
	}
}

export default withRouter(User);
