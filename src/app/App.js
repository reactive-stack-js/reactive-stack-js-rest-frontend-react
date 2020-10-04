import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';

import AuthService from '../util/auth.service';

import Header from "./pages/header/Header";
import Social from "./pages/login/Social";
import Logout from './pages/logout/Logout';
import About from "./pages/about/About";
import Lorems from "./pages/lorems/Lorems";
import Lorem from "./pages/lorem/Lorem";

class App extends Component {
	state = {
		user: {},
		jwt: '',
		activeItem: '/',
	};

	async componentDidMount() {
		this.subscription = AuthService.subscribe({next: (data) => this.setState(data)});
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		return (
			<div id="reactive-stack-app">
				<div id="header">
					<Header/>
				</div>

				<div id="content">
					{/* A <Switch> looks through its children <Route>s and renders the first one that matches the current URL. */}
					<Switch>
						<Route path="/about"><About/></Route>
						<Route path="/lorem/:loremId"><Lorem/></Route>

						<Route path="/logout"><Logout/></Route>
						<Route path="/login/facebook"><Social/></Route>
						<Route path="/login/google"><Social/></Route>

						{/* ROOT MUST BE LAST!!! */}
						<Route path="/"><Lorems/></Route>
					</Switch>
				</div>
			</div>
		);
	}
}

export default withRouter(App);
