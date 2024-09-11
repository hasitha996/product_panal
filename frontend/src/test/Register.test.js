import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import Register from "../components/Register";
import { BrowserRouter as Router } from "react-router-dom";
import AuthService from "../services/auth.service";

// Mock AuthService to control its behavior in tests
jest.mock("../services/auth.service");

describe("Register Component", () => {
  it("renders the Register form", () => {
    render(
      <Router>
        <Register />
      </Router>
    );
    
    // Check if the form fields and the button are rendered
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("shows required field errors when form is submitted empty", async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    // Click the register button without filling in the form
    fireEvent.click(screen.getByText("Register"));

    // Expect required field error messages to be shown
    await waitFor(() => {
      expect(screen.getAllByText("This field is required!")).toHaveLength(3); // 3 required fields
    });
  });

  it("calls AuthService.register when valid form is submitted", async () => {
    // Mock successful registration response
    AuthService.register.mockResolvedValueOnce({ data: { message: "Registration successful!" } });

    render(
      <Router>
        <Register />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    // Click on the register button
    fireEvent.click(screen.getByText("Register"));

    // Wait for the registration function to be called
    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith("newuser", "newuser@example.com", "password");
    });

    // Check if successful registration message is displayed
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Registration successful!");
    });
  });

  it("displays an error message if registration fails", async () => {
    // Mock a failed registration response
    AuthService.register.mockRejectedValueOnce({
      response: { data: { message: "User already exists" } },
    });

    render(
      <Router>
        <Register />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "existinguser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existinguser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    // Click on the register button
    fireEvent.click(screen.getByText("Register"));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("User already exists");
    });
  });

  it("disables the register button when form is being submitted", async () => {
    // Mock a delayed registration response
    AuthService.register.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <Router>
        <Register />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    // Click on the register button
    fireEvent.click(screen.getByText("Register"));

    // The button should be disabled during the registration process
    expect(screen.getByText("Register")).toBeDisabled();
  });
});
