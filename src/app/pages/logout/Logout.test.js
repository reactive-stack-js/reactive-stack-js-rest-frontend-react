import React from "react";
import {render} from "@testing-library/react";
import Logout from "./Logout";

test("renders learn react link", () => {
	const {getByText} = render(<Logout/>);
	const logoutElement = getByText(/logout.../i);
	expect(logoutElement).toBeInTheDocument();
});
