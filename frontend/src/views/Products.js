import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCog, faComments, faPlus } from '@fortawesome/free-solid-svg-icons';
import ProductTable from '../components/ProductTable';
import FilterBar from '../components/FilterBar';
import FormModal from '../components/FormModal';
import ProductForm from '../components/ProductForm';
import apiService from '../services/api.service'; // Import   API service
import msgService from '../services/msg.service'; // Import   message service
import styles from '../assets/css/page/Product.module.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from the API
  const loadData = async () => {
    try {
      const response = await apiService.get('/products');
      const { products, categories, tags, members } = response;

      setProducts(products);
      setCategories(categories);
      setTags(tags);
      setMembers(members);
    } catch (error) {
      msgService.error('Failed to load data');
    }
  };

  // Function to handle deleting a product
  const handleDeleteProduct = async (productId) => {
    try {
      await apiService.delete(`/product_delete/${productId}`); 
      setProducts(products.filter(product => product.id !== productId));
      msgService.success('Product deleted successfully');
    } catch (error) {
      msgService.error('Failed to delete product');
    }
  };
  

  // Function to handle adding a new product or editing an existing one
  const handleSaveProduct = async (productData) => {
    try {
      if (isModalEdit) {
        // Update existing product
        const response = await apiService.put(`/product_update/${modalProduct.id}`, productData);
        if (response) {
          msgService.success('Product updated successfully');
        }
   
      } else {
        // Add new product
        const response = await apiService.post('/create_products', productData);
        if (response) {
          msgService.success('Product added successfully');
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      msgService.error('Failed to save product');
    }
  };

  // Function to handle opening the modal for adding or editing a product
  const handleAddProduct = () => {
    setModalProduct(null); // Ensure modalProduct is cleared
    setIsModalEdit(false);
    setIsModalOpen(true);
  };

  // Function to handle editing a product
  const handleEditProduct = async (product) => {
    try {
      // Fetch the full product details from the API
      const response = await apiService.get(`/one_product/${product.id}`);
      
      setModalProduct(response); // Set the modal product data
      setIsModalEdit(true);      // Indicate that we are editing
      setIsModalOpen(true);      // Open the modal
    } catch (error) {
      msgService.error('Failed to load product data for editing');
    }
  };

  // Function to handle filter changes
  const handleFilterChange = (filterType, values) => {
    console.log(`Filter changed: ${filterType} -`, values);
    // Implement filter logic
  };

  // Filter products based on global search filter
  const filteredProducts = (products && Array.isArray(products))
    ? products.filter(product =>
      product.description.toLowerCase().includes(globalFilter.toLowerCase())
    )
    : [];

  return (
    <div className={styles.productPage}>
      <div className={styles.header}>
        <div className={styles.headerIcons}>
          <h1>Product</h1>
        </div>
        <div className={styles.headerActions}>
          <FontAwesomeIcon icon={faSearch} className={styles.icon} />
          <input
            type="search"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faComments} className={styles.icon} />
          <FontAwesomeIcon icon={faCog} className={styles.icon} />
          <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleAddProduct} />
        </div>
      </div>
      <FilterBar
        tags={tags} // Pass the tags here
        brands={categories} // Pass the categories here
        onFilterChange={(filterType, values) => {
          handleFilterChange(filterType, values);
        }}
        products={products}
        setIsModalOpen={handleAddProduct}
      />
      <ProductTable
        products={filteredProducts}
        globalFilter={globalFilter}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onDelete={handleDeleteProduct}
        onEdit={handleEditProduct}
        recordCount={filteredProducts.length}
      />
      <FormModal
        moduleName="Product"
        show={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        width="400px"
      >
        <ProductForm
          product={modalProduct}
          onSave={handleSaveProduct}
          onClose={() => setIsModalOpen(false)}
          categories={categories} // Pass the categories here
          tags={tags} // Pass the tags here
          members={members} // Pass the members here
        />
      </FormModal>
    </div>
  );
};

export default Product;
