import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faBuilding, faBox, faCalendar, faFileImport, faSort, faFilter } from '@fortawesome/free-solid-svg-icons';
import { MultiSelect } from 'primereact/multiselect';
import styles from '../assets/css/component/filterbar.module.css';

const FilterBar = ({ tags = [], brands = [], onFilterChange, products = [], setIsModalOpen }) => {
  const [selectedTags, setSelectedTags] = useState(tags);
  const [selectedBrands, setSelectedBrands] = useState(brands);

  // Extract unique tags and brands from products
  const uniqueTags = [...new Set(products.flatMap(product => product.tags))];
  const uniqueBrands = [...new Set(products.map(product => product.brand))];

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'tags') {
      setSelectedTags(value);
    } else if (type === 'brands') {
      setSelectedBrands(value);
    }
    onFilterChange(type, value);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterItem}>
        <FontAwesomeIcon icon={faBuilding} className={styles.filterIcon} />
        <MultiSelect
          value={selectedBrands}
          options={uniqueBrands.map(brand => ({ label: brand, value: brand }))}
          onChange={(e) => handleFilterChange('brands', e.value)}
          placeholder="Brands"
          className={styles.multiSelect}
        />
      </div>

      <div className={styles.filterItem}>
        <FontAwesomeIcon icon={faTag} className={styles.filterIcon} />
        <MultiSelect
          value={selectedTags}
          // options={uniqueTags.map(tag => ({ label: tag, value: tag }))}
          // onChange={(e) => handleFilterChange('tags', e.value)}
          placeholder="Tags"
          className={styles.multiSelect}
        />
      </div>

      <div className={styles.filterItem}>
        <FontAwesomeIcon icon={faSort} className={styles.filterIcon} />
        <MultiSelect
          placeholder="Sort"
          className={styles.multiSelect}
        />
      </div>

      <div className={styles.filterItem}>
        <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
        <MultiSelect
          placeholder="Filter"
          className={styles.multiSelect}
        />
      </div>

      <div className={styles.headerActions}>
        <button onClick={() => setIsModalOpen(true)} className={styles.addButton} aria-label="Add Product">
          <FontAwesomeIcon icon={faBox} className={styles.buttonIcon} />
          Add Product
        </button>
        <button className={styles.addButton} aria-label="Meeting">
          <FontAwesomeIcon icon={faCalendar} className={styles.buttonIcon} />
          Meeting
        </button>
        <button className={styles.exportButton} aria-label="Import/Export">
          <FontAwesomeIcon icon={faFileImport} className={styles.buttonIcon} />
          Import/Export
        </button>
      </div>
    </div>
  );
};

// Prop types for validation
FilterBar.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  brands: PropTypes.arrayOf(PropTypes.string),
  onFilterChange: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
    brand: PropTypes.string
  })),
  setIsModalOpen: PropTypes.func.isRequired
};

export default FilterBar;
