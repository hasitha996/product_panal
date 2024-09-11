import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from '../components/FilterBar';

const mockTags = ['Tag1', 'Tag2'];
const mockBrands = ['Brand1', 'Brand2'];
const mockProducts = [
  { tags: ['Tag1'], brand: 'Brand1' },
  { tags: ['Tag2'], brand: 'Brand2' }
];

describe('FilterBar Component', () => {
  test('should render filter options and handle changes', () => {
    const handleFilterChange = jest.fn();

    render(<FilterBar
      tags={mockTags}
      brands={mockBrands}
      onFilterChange={handleFilterChange}
      products={mockProducts}
      setIsModalOpen={() => {}}
    />);

    fireEvent.change(screen.getByPlaceholderText(/Tags/i), { target: { value: ['Tag1'] } });
    expect(handleFilterChange).toHaveBeenCalledWith('tags', ['Tag1']);

    fireEvent.change(screen.getByPlaceholderText(/Brands/i), { target: { value: ['Brand1'] } });
    expect(handleFilterChange).toHaveBeenCalledWith('brands', ['Brand1']);
  });
});
