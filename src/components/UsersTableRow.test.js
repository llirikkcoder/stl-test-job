// Тесты для компонента UsersTableRow

import React from "react";
import { render } from "@testing-library/react";
import UsersTableRow from "./UsersTableRow";

describe("UsersTableRow", () => {
  it("should render user data", () => {
    const user = {
      id: 1,
      username: "test",
      email: "test@test.com",
      age: "20",
      country: "Russia",
    };
    const { getByText } = render(<UsersTableRow user={user} />);

    expect(getByText(user.username)).toBeInTheDocument();
    expect(getByText(user.email)).toBeInTheDocument();
    expect(getByText(user.age)).toBeInTheDocument();
    expect(getByText(user.country)).toBeInTheDocument();
  });
});
