import React from "react";
import {render} from "@testing-library/react";
import Social from "./Social";

test("renders learn react link", () => {
	const {getByText} = render(<Social/>);
	const loginElement = getByText(/login.../i);
	expect(loginElement).toBeInTheDocument();
});
