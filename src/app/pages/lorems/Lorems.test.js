import React from "react";
import {render} from "@testing-library/react";
import Lorems from "./Lorems";

test("renders learn react link", () => {
	const {getByText} = render(<Lorems/>);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
