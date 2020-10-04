import _ from 'lodash';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import 'fomantic-ui-css/semantic.css';

import {v4 as uuidv4} from 'uuid';
import queryString from 'query-string';

import AuthService from '../../../util/auth.service';

const API = process.env.REACT_APP_API_PATH;
const FB_APP_ID = process.env.REACT_APP_FB_APP_ID;
const FB_REDIRECT_URI = document.location.origin + '/login/facebook';

const GG_APP_ID = process.env.REACT_APP_GG_APP_ID;
const GG_REDIRECT_URI = document.location.origin + '/login/google';
const GG_SCOPE = 'email profile';

const _getApiAndRedirect = (provider) => {
	switch (provider) {
		case 'facebook':
			return {
				api: '/auth/facebook',
				redirect_uri: FB_REDIRECT_URI,
			};
		case 'google':
			return {
				api: '/auth/google',
				redirect_uri: GG_REDIRECT_URI,
			};
		default:
			throw new Error('Social::getApiAndRedirect:Unknown provider: ' + provider);
	}
};

const _getSocialUrl = (provider) => {
	switch (provider) {
		case 'facebook':
			return `https://www.facebook.com/v5.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&state=${uuidv4()}`;
		case 'google':
			return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GG_APP_ID}&redirect_uri=${GG_REDIRECT_URI}&response_type=code&scope=${GG_SCOPE}`;
		default:
			throw new Error('Social::getSocialUrl:Unknown provider: ' + provider);
	}
};

const _getTitle = (provider) => {
	return provider ? _.upperFirst(_.toLower(provider)) : '';
};

class Social extends Component {
	state = {};

	login = async (code) => {
		const {api, redirect_uri} = _getApiAndRedirect(this.state.provider);
		const response = await fetch(API + api, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({code, redirect_uri}),
		});
		const body = await response.json();
		const {jwt, user} = body;
		AuthService.login(user, jwt);

		const initialPageRequest = localStorage.getItem('initialPageRequest');
		localStorage.removeItem('initialPageRequest');

		if (initialPageRequest && '/logout' !== initialPageRequest) this.props.history.push(initialPageRequest);
		else this.props.history.push('/');
	};

	static getDerivedStateFromProps(props, state = {}) {
		state.provider = _.replace(props.location.pathname, '/login/', '');
		return state;
	}

	componentDidMount() {
		if (!this.state.provider) return;
		const params = queryString.parse(this.props.location.search);
		if (!params || !params.code) {
			let url = _getSocialUrl(this.state.provider);
			window.location.replace(url);
			return null;
		}
		this.login(params.code);
	}

	render() {
		return (
			<p style={{padding: 20}}>{_getTitle(this.state.provider)} Logging in...</p>
		);
	}
}

export default withRouter(Social);
