import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import * as serviceWorker from "./util/service.worker";

import App from "./app/App";
import store from "./redux/store";

render(
	<Provider store={store}>
		<Router>
			<App/>
		</Router>
	</Provider>,
	document.body,
);

// If you want your app to work offline and load faster, you can change unregister() to register() below.
// Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
