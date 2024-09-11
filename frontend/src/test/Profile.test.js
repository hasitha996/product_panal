import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';
import apiService from '../services/api.service';

// Mock the API service
jest.mock('../services/api.service');

describe('Profile Component', () => {
  const mockUser = {
    id: '1',
    first_name: 'abc',
    last_name: 'group',
    email: 'abc@example.com',
    password: '',
    profile_picture: null,
  };

  const mockGetCurrentUser = jest.fn(() => mockUser);
  AuthService.getCurrentUser = mockGetCurrentUser;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile form with user data', () => {
    render(<Profile showModal={true} onClose={() => {}} />);

    // Check if form fields are rendered with correct values
    expect(screen.getByLabelText(/First Name/i)).toHaveValue(mockUser.first_name);
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue(mockUser.last_name);
    expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email);
  });

  test('updates profile data on form submission', async () => {
    apiService.upload.mockResolvedValueOnce({}); // Mock successful API response

    render(<Profile showModal={true} onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'jane.smith@example.com' },
    });

    const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText(/Profile Picture/i), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(apiService.upload).toHaveBeenCalledWith('/users/update', expect.any(FormData));
    });
  });

  test('handles API error on form submission', async () => {
    apiService.upload.mockRejectedValueOnce(new Error('Failed to update profile')); // Mock failed API response

    render(<Profile showModal={true} onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(apiService.upload).toHaveBeenCalled();
      expect(screen.getByText(/Failed to update profile./i)).toBeInTheDocument();
    });
  });
});
