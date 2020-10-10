import React, {useEffect} from "react";
import ClientSocket from "../../../util/client.socket";

export default function About() {

	useEffect(() => {
		ClientSocket.location();
	});

	return (
		<p style={{padding: 10}}>Reactive Stack Web Application</p>
	);
}
