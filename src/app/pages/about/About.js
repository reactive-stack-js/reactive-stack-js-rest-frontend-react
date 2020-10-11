import React, {useEffect} from "react";
import ClientSocket from "../../../_reactivestack/client.socket";

export default function About() {

	useEffect(() => {
		ClientSocket.location();
	});

	return (
		<p style={{padding: 10}}>Reactive Stack Web Application</p>
	);
}
