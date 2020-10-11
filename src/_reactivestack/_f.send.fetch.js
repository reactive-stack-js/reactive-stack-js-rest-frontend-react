import AuthService from "./auth.service";

export const sendFetchGet = async (url) => {
	const response = await fetch(url, {
		method: "GET",
		headers: AuthService.getAuthHeader()
	});
	return await response.json();
}

export const sendFetchPost = async (url, bodyObject) => {
	return fetch(url, {
		method: "POST",
		headers: AuthService.getAuthHeader(),
		body: JSON.stringify(bodyObject)
	});
}
