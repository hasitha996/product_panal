import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../views/login';
import AuthService from '../services/auth.service';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

// Mock the AuthService
jest.mock('../services/auth.service');

describe('Login Component', () => {
  beforeEach(() => {
    AuthService.login.mockClear();
  });

  test('renders the login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Register")).toBeInTheDocument();
  });

  test('shows validation message when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Submit the form without entering username or password
    fireEvent.click(screen.getByText(/Login/i));

    // Check that validation messages are displayed
    await waitFor(() => {
      expect(screen.getByText(/This field is required!/i)).toBeInTheDocument();
    });
  });

  test('calls AuthService login and redirects on successful login', async () => {
    // Mock successful login
    AuthService.login.mockResolvedValueOnce();

    const navigateMock = jest.fn();

    render(
      <MemoryRouter>
        <Login router={{ navigate: navigateMock }} />
      </MemoryRouter>
    );

    // Fill in the username and password fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Login/i));

    // Check that the login function is called and user is redirected
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(navigateMock).toHaveBeenCalledWith('/products');
    });
  });

  test('displays error message on failed login', async () => {
    // Mock failed login
    AuthService.login.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in the username and password fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Login/i));

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('starts background image rotation', () => {
    jest.useFakeTimers(); // Mock the timer

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check initial background image
    const backgroundImageElement = document.querySelector('.loginContainer .backgroundImage');
    expect(backgroundImageElement).toHaveStyle(
      `backgroundImage: url(https://cdn.pixabay.com/photo/2021/01/05/06/40/boat-5889919_1280.png)`
    );

    // Simulate the passage of 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Check that the background image changed
    expect(backgroundImageElement).toHaveStyle(
      `backgroundImage: url(https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png)`
    );
  });
});
