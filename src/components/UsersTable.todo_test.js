import React from "react";
import { render, screen } from "@testing-library/react";

import UsersTable from "./UsersTable";

test("Render component", () => {
  render(<UsersTable />);
  const input = screen.getByText("John Doe");
  expect(input).toBeVisible();
});
