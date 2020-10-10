import React from "react";
import "./Title.css";

export default function Title() {
	return (
		<div className="vertical-center">
			<h1>
				<b>Reactive Stack</b>
				&nbsp;
				<span className="with">with <a href="//www.fastify.io/" target="_blank" rel="noopener noreferrer">Fastify</a> & <a href="//reactjs.org" target="_blank" rel="noopener noreferrer">React</a></span>
				&nbsp;
				<span className="github">(<a href="//github.com/cope/reactive-stack/tree/master/meteor-react" target="_blank" rel="noopener noreferrer">github</a>)</span>
			</h1>
		</div>
	);
}
