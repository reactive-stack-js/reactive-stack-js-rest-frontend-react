import AuthService from "./auth.service";

export const sendGet = async (url) => {
	const response = await fetch(url, {
		method: "GET",
		headers: AuthService.getAuthHeader()
	});
	return await response.json();
}

export const sendPost = async (url, bodyObject) => {
	return fetch(url, {
		method: "POST",
		headers: AuthService.getAuthHeader(),
		body: JSON.stringify(bodyObject)
	});
}
