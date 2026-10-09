import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import LoginPage from "@/app/login/page";

// Mock Next.js router
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Page should render
  it("renders the login page", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    // IMPORTANT:
    // Use exact "Password" so it doesn't also match
    // the "Show password" button.
    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /^login$/i })
    ).toBeInTheDocument();
  });

  // 2. User should be able to enter email
  it("allows the user to enter email", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);

    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  // 3. User should be able to enter password
  it("allows the user to enter password", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("Password");

    await user.type(passwordInput, "Password123");

    expect(passwordInput).toHaveValue("Password123");
  });

  // 4. Empty form validation
it("shows validation when submitting empty form", async () => {
  const user = userEvent.setup();

  render(<LoginPage />);

  await user.click(
    screen.getByRole("button", { name: /^login$/i })
  );

  expect(
    await screen.findByText("Email address is required.")
  ).toBeInTheDocument();

  expect(
    await screen.findByText("Password is required.")
  ).toBeInTheDocument();

  expect(global.fetch).not.toHaveBeenCalled();
});

  // 5. Invalid email validation
  it("shows validation for invalid email", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "invalid-email");
    await user.type(passwordInput, "Password123");

    await user.click(
      screen.getByRole("button", { name: /^login$/i })
    );

    expect(
      await screen.findByText(/valid email|invalid email/i)
    ).toBeInTheDocument();

    // API should not be called when client validation fails
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // 6. Successful login
  it("logs in successfully with valid credentials", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: "fake-token",
        user: {
          id: "123",
          email: "test@example.com",
        },
      }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText("Password");

    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "Password123");

    await user.click(
      screen.getByRole("button", { name: /^login$/i })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  // 7. Invalid credentials / API error
  it("shows error when login fails", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Invalid email or password",
      }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText("Password");

    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "WrongPassword");

    await user.click(
      screen.getByRole("button", { name: /^login$/i })
    );

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // 8. Network/API failure
  it("handles network error", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText("Password");

    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "Password123");

    await user.click(
      screen.getByRole("button", { name: /^login$/i })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});