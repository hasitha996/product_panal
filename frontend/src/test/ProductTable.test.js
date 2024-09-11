import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from '../components/ProductTable';

const mockProducts = [
  { id: '1', description: 'Product 1', brand: 'Brand A', tags: ['Tag 1'], categories: ['Category 1'], members: [{ name: 'Member 1' }], nextMeeting: '2024-09-30' },
  { id: '2', description: 'Product 2', brand: 'Brand B', tags: ['Tag 2'], categories: ['Category 2'], members: [{ name: 'Member 2' }], nextMeeting: '2024-10-01' }
];

describe('ProductTable Component', () => {
  test('should render product table and handle actions', () => {
    const handleDelete = jest.fn();
    const handleEdit = jest.fn();

    render(<ProductTable
      products={mockProducts}
      globalFilter=""
      selectedProducts={[]}
      setSelectedProducts={() => {}}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />);

    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Product 2/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByText(/Edit/i)[0]);
    expect(handleEdit).toHaveBeenCalledWith(mockProducts[0]);

    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  test('should handle pagination', () => {
    render(<ProductTable
      products={mockProducts}
      globalFilter=""
      selectedProducts={[]}
      setSelectedProducts={() => {}}
      onDelete={() => {}}
      onEdit={() => {}}
    />);

    expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument();
  });
});
