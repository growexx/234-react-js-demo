import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Header from "../Header";
import { store } from "../../app/store";
import { BrowserRouter } from "react-router-dom";
import { headerWithAuth } from "./mock";
import { useAuth } from "../../hooks/useAuth";
import { logOut } from "../../features/auth/authSlice";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../features/auth/authSlice", () => ({
  logOut: jest.fn(),
}));

describe("Header Component", () => {
  const header = (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );

  let isAuthenticated;
  beforeEach(() => {
    isAuthenticated = false;
    useAuth.mockReturnValue([isAuthenticated]);
    logOut.mockReturnValue({ type: "auth/logOut" });
  });

  it("renders header with correct title and when user is not authenticated", () => {
    render(header);

    const headingElement = screen.getByRole("heading", { level: 3 });
    expect(headingElement).toHaveTextContent(/Blog Panel/i);

    const headingText = screen.getByText(/Blog Panel/i);
    expect(headingText).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "Login" });
    expect(loginLink).toBeInTheDocument();
  });

  it("renders profile links when user is authenticated", () => {
    isAuthenticated = true;
    useAuth.mockReturnValue([isAuthenticated]);
    render(header);

    headerWithAuth.tabs.map((tab) => {
      const link = screen.getByRole("link", { name: tab });
      expect(link).toBeInTheDocument();
    });
  });

  it("render when user is clicked 'Logout' link", () => {
    isAuthenticated = true;
    useAuth.mockReturnValue([isAuthenticated]);
    render(header);

    const logoutLink = screen.getByRole("link", { name: /logout/i });
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toBeVisible();

    fireEvent.click(logoutLink);
    expect(logOut).toHaveBeenCalled();
    expect(logOut).toHaveBeenCalledTimes(1);
  });
});

