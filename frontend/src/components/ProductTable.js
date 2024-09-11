import React, { useState } from 'react';
import styles from '../assets/css/page/Product.module.css';

// Constant for the number of products per page
const PAGE_SIZE = 12;

// Utility function to generate random colors
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate random image URL
const getRandomImageUrl = () => {
  const randomId = Math.floor(Math.random() * 1000) + 1;
  return `https://picsum.photos/id/${randomId}/100/100`; 
};

// Initialize an object to store category colors
const categoryColors = {};

// Function to get category style based on the category name
const getCategoryStyle = (category) => {
  if (!categoryColors[category]) {
    categoryColors[category] = getRandomColor();
  }
  return {
    backgroundColor: categoryColors[category],
    padding: '2px 4px',
    borderRadius: '4px',
    color: '#fff',
    margin: '2px',
  };
};

// Function to render member images and names
const renderMembers = (members) => {
  if (Array.isArray(members)) {
    return members.map((member, index) => (
      <div key={index} className={styles.member}>
        <img src={getRandomImageUrl()} alt={member.name} className={styles.memberImage} />
        <span className={styles.memberName}>{member.name}</span>
      </div>
    ));
  }
  return '';
};

// Function to safely join array items or return an empty string
const safeJoin = (items, property, colorize = false) => {
  if (Array.isArray(items)) {
    return items.map((item, index) => (
      <span key={index} style={colorize && property === 'name' ? getCategoryStyle(item[property]) : {}}>
        {property === 'name' && !colorize ? `#${item[property] || ''}` : item[property] || ''}
      </span>
    ));
  }
  return '';
};

// The main ProductTable component
const ProductTable = ({ products, globalFilter, selectedProducts, setSelectedProducts, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on global filter
  const filteredProducts = products.filter(product => {
    const filter = globalFilter.toLowerCase();
    return (
      product.description.toLowerCase().includes(filter) ||
      product.brand.toLowerCase().includes(filter) ||
      (product.tags || []).some(tag => tag.toLowerCase().includes(filter))
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th></th>
              <th>Brand</th>
              <th>Description</th>
              <th>Members</th>
              <th>Categories</th>
              <th>Tags</th>
              <th>Next Meeting</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => setSelectedProducts(prev => prev.includes(product.id)
                      ? prev.filter(id => id !== product.id)
                      : [...prev, product.id]
                    )}
                  />
                </td>
                <td>{product.brand}</td>
                <td>{product.description}</td>
                <td>{renderMembers(product.members || [])}</td>
                <td>{safeJoin(product.categories || [], 'name', true)}</td>
                <td>{safeJoin(product.tags || [], 'name')}</td>
                <td>{product.nextMeeting}</td>
                <td>
                  <button onClick={() => onEdit(product)} className={styles.editButton}>Edit</button>
                  <button onClick={() => onDelete(product.id)} className={styles.deleteButton}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <span className={styles.recordCount}>Total Products: {filteredProducts.length}</span>
    </div>
  );
};

export default ProductTable;
