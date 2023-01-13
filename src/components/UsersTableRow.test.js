// Тесты для компонента UsersTableRow

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
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

  it("should render edit form", () => {
    const user = {
      id: 1,
      username: "test",
      email: "test@test.com",
      age: "20",
      country: "Russia",
    };
    const { getByText, getByDisplayValue } = render(
      <UsersTableRow user={user} />
    );

    fireEvent.click(getByText("Edit"));

    expect(getByDisplayValue(user.username)).toBeInTheDocument();
    expect(getByDisplayValue(user.email)).toBeInTheDocument();
    expect(getByDisplayValue(user.age)).toBeInTheDocument();
    expect(getByDisplayValue(user.country)).toBeInTheDocument();
  });

  it("should save user", async () => {
    const user = {
      id: 1,
      username: "test",
      email: "test@test.com",
      age: "20",
      country: "Russia",
    };
    const { getByText, getByDisplayValue } = render(
      <UsersTableRow user={user} />
    );

    fireEvent.click(getByText("Edit"));
    fireEvent.change(getByDisplayValue(user.username), {
      target: { value: "test2" },
    });
    fireEvent.change(getByDisplayValue(user.email), {
      target: { value: "test2@test.com" },
    });
    fireEvent.change(getByDisplayValue(user.age), { target: { value: "21" } });
    fireEvent.change(getByDisplayValue(user.country), {
      target: { value: "USA" },
    });
    fireEvent.click(getByText("Save"));

    await waitFor(() => {
      expect(getByText("test2")).toBeInTheDocument();
      expect(getByText("test2@test.com")).toBeInTheDocument();
      expect(getByText("21")).toBeInTheDocument();
      expect(getByText("USA")).toBeInTheDocument();
    });
  });

  it("should cancel edit", async () => {
    const user = {
      id: 1,
      username: "test",
      email: "test@test.com",
      age: "20",
      country: "Russia",
    };
    const { getByText, getByDisplayValue } = render(
      <UsersTableRow user={user} />
    );

    fireEvent.click(getByText("Edit"));
    fireEvent.change(getByDisplayValue(user.username), {
      target: { value: "test2" },
    });
    fireEvent.change(getByDisplayValue(user.email), {
      target: { value: "test2@test.com" },
    });
    fireEvent.change(getByDisplayValue(user.age), { target: { value: "21" } });
    fireEvent.change(getByDisplayValue(user.country), {
      target: { value: "USA" },
    });
    fireEvent.click(getByText("Cancel"));

    await waitFor(() => {
      expect(getByText("test")).toBeInTheDocument();
      expect(getByText("test@test.com")).toBeInTheDocument();
      expect(getByText("20")).toBeInTheDocument();
      expect(getByText("Russia")).toBeInTheDocument();
    });
  });
});
