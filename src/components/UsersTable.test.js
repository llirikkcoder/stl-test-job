import { render, waitFor, fireEvent } from "@testing-library/react";
import UsersTable from "./UsersTable";

describe("UsersTable", () => {
  it("renders the table and sorts the columns correctly", async () => {
    // Render the component
    const { getByText, findByText } = render(<UsersTable />);

    // Wait for the table to be rendered
    const table = await findByText("Username");

    // Check if the first column is 'Username'
    expect(table).toBeInTheDocument();

    // Check if the second column is 'Email'
    expect(getByText("Email")).toBeInTheDocument();

    // Check if the third column is 'Age'
    expect(getByText("Age")).toBeInTheDocument();

    // Check if the forth column is 'Country'
    expect(getByText("Country")).toBeInTheDocument();

    // Check if the fifth column is 'Actions'
    expect(getByText("Actions")).toBeInTheDocument();

    // Click on the 'Age' column to sort it in ascending order
    fireEvent.click(getByText("Age"));

    // Wait for the table to be re-rendered
    const ageSortedAsc = await findByText("Age");

    // Check if the table is sorted in ascending order by 'Age'
    expect(ageSortedAsc).toBeInTheDocument();

    // Click on the 'Age' column to sort it in descending order
    fireEvent.click(getByText("Age"));

    // Wait for the table to be re-rendered
    const ageSortedDesc = await findByText("Age");

    // Check if the table is sorted in descending order by 'Age'
    expect(ageSortedDesc).toBeInTheDocument();
  });
});
