import React from 'react';
import _ from "lodash";

export default function Menu() {

	let pathname = _.replace(window.location.pathname, '/', '');

	if (_.isEmpty(pathname)) {
		return (
			<div className="vertical-center">
				<a href="/about">About</a>
			</div>
		);
	}

	if ('about' === pathname) {
		return (
			<div className="vertical-center">
				<a href="/">Mahahaklice</a>
			</div>
		);
	}

	return (<span></span>);
}
