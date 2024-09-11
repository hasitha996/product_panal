import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product from '../views/Products';
import apiService from '../services/api.service';


// Mock the API and message services
jest.mock('../services/api.service');
jest.mock('../services/msg.service');

describe('Product Component', () => {
  const mockProducts = [
    { id: 1, description: 'Product 1' },
    { id: 2, description: 'Product 2' },
  ];
  
  const mockCategories = [{ id: 1, name: 'Category 1' }];
  const mockTags = [{ id: 1, name: 'Tag 1' }];
  const mockMembers = [{ id: 1, name: 'Member 1' }];

  beforeEach(() => {
    apiService.get.mockResolvedValue({
      products: mockProducts,
      categories: mockCategories,
      tags: mockTags,
      members: mockMembers,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Product component correctly', async () => {
    render(<Product />);

    // Check that the header is displayed
    expect(screen.getByText(/Product/i)).toBeInTheDocument();

    // Check that the search input is displayed
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();

    // Wait for products to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  test('search input filters products', async () => {
    render(<Product />);

    // Wait for products to be loaded
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    // Filter by searching for "Product 1"
    fireEvent.change(screen.getByPlaceholderText(/Search.../i), {
      target: { value: 'Product 1' },
    });

    // Only "Product 1" should be visible
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).toBeNull();
  });

  test('opens modal on clicking add product button', async () => {
    render(<Product />);

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /plus/i }));

    // Check if the modal opens
    await waitFor(() => {
      expect(screen.getByText(/Save Product/i)).toBeInTheDocument();
    });
  });

  test('deletes a product', async () => {
    render(<Product />);

    // Wait for products to be loaded
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    // Mock API delete call
    apiService.delete.mockResolvedValueOnce();

    // Simulate deleting a product
    fireEvent.click(screen.getByText(/Delete/i));

    // Wait for deletion to complete
    await waitFor(() => {
      expect(apiService.delete).toHaveBeenCalledWith('/product_delete/1');
    });

    // Ensure product 1 is no longer in the document
    expect(screen.queryByText('Product 1')).toBeNull();
  });
});
