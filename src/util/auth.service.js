import {BehaviorSubject} from "rxjs";

const DEFAULT_USER_INFO = {user: {}, jwt: ""};

const _getLocalStorageUserInfo = () => {
	let userInfo = localStorage.getItem("userInfo");
	return userInfo ? JSON.parse(userInfo) : DEFAULT_USER_INFO;
};

class AuthService extends BehaviorSubject {
	state = {
		user: {},
		jwt: "",
	};

	constructor() {
		super();
		this.checkLocalStorage();
	}

	user() {
		return this.state.user;
	}

	jwt() {
		return this.state.jwt;
	}

	loggedIn() {
		return !!this.state.user.id;
	}

	sendState(state) {
		this.state = state;
		this.next(state);
	}

	checkLocalStorage() {
		let userInfo = _getLocalStorageUserInfo();
		if (!!userInfo && !!userInfo.user && !!userInfo.user.expires_at) {
			const expiresAt = userInfo.user.expires_at;
			const now = new Date().getTime();
			if (now < expiresAt) return this.sendState(userInfo);
		}
		this.logout();
	}

	refresh({user, jwt}) {
		if (!!user && !!jwt) {
			localStorage.setItem("userInfo", JSON.stringify({user, jwt}));
			this.sendState({user, jwt});
		} else {
			// TODO: error?
		}
	}

	login(user, jwt) {
		if (!!user && !!jwt) {
			localStorage.setItem("userInfo", JSON.stringify({user, jwt}));
			this.sendState({user, jwt});
		} else {
			this.logout();
		}
	}

	logout() {
		localStorage.removeItem("userInfo");
		this.sendState(DEFAULT_USER_INFO);
	}

	getAuthHeader() {
		return {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + _getLocalStorageUserInfo().jwt,
		};
	}
}

export default new AuthService();
