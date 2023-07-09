import { render, screen } from "@testing-library/react";
import Public from "../Public";
import { publicWithoutAuth } from "./mock";
import { BrowserRouter } from "react-router-dom";

describe("Public Component", () => {
  const publicComponent = (
    <BrowserRouter>
      <Public />
    </BrowserRouter>
  );

  it("renders when user is not authenticated", async () => {
    render(publicComponent);

    const headingText = await screen.findByText(publicWithoutAuth.name);
    expect(headingText).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "User Login" });
    expect(loginLink).toBeInTheDocument();
  });
});
