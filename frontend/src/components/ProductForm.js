import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../assets/css/page/Product.module.css'; 

const ProductForm = ({ product, categories, tags, members, onSave, onClose }) => {
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [nextMeeting, setNextMeeting] = useState(new Date());

  useEffect(() => {
    if (product) {
      setBrand(product.brand || "");
      setDescription(product.description || "");

      // Parse members if they come as a stringified array, otherwise assume it's an array
      const productMembers = typeof product.members === 'string' ? JSON.parse(product.members) : product.members;
      
      // Ensure `Categories` and `Tags` are arrays (product.Categories and product.Tags are arrays of objects)
      const productCategories = product.Categories || [];
      const productTags = product.Tags || [];

      // Set the selected members, categories, and tags using the provided data
      setSelectedCategories(
        categories.filter(cat => productCategories.some(pCat => pCat.id === cat.id)) || []
      );
      setSelectedTags(
        tags.filter(tag => productTags.some(pTag => pTag.id === tag.id)) || []
      );
      setSelectedMembers(
        members.filter(member => productMembers.includes(member.id)) || []
      );

      setNextMeeting(product.nextMeeting ? new Date(product.nextMeeting) : new Date());
    }
  }, [product, categories, tags, members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSave({
        brand,
        description,
        members: selectedMembers.map(member => member.id),
        categories: selectedCategories.map(cat => cat.id),
        tags: selectedTags.map(tag => tag.id),
        nextMeeting: nextMeeting.toISOString() // Format date for submission
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-3">
        <label htmlFor="brand" className="form-label">Brand:</label>
        <input
          type="text"
          id="brand"
          className="form-control"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description:</label>
        <textarea
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="members" className="form-label">Members:</label>
        <MultiSelect
          id="members"
          value={selectedMembers}
          options={members}
          onChange={(e) => setSelectedMembers(e.value)}
          optionLabel="username" // Change to the appropriate property from members
          className={styles.multiSelectWrapper} // Apply custom styles
          placeholder="Select members"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="categories" className="form-label">Categories:</label>
        <MultiSelect
          id="categories"
          value={selectedCategories}
          options={categories}
          onChange={(e) => setSelectedCategories(e.value)}
          optionLabel="name" // Adjust   category object
          className={styles.multiSelectWrapper} // Apply custom styles
          placeholder="Select categories"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="tags" className="form-label">Tags:</label>
        <MultiSelect
          id="tags"
          value={selectedTags}
          options={tags}
          onChange={(e) => setSelectedTags(e.value)}
          optionLabel="name" // Adjust   tag object
          className={styles.multiSelectWrapper} // Apply custom styles
          placeholder="Select tags"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="nextMeeting" className="form-label">Next Meeting:</label>
        <DatePicker
          selected={nextMeeting}
          onChange={(date) => setNextMeeting(date)}
          className="form-control"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select a date"
        />
      </div>
      <div className="d-flex justify-content-end mb-2">
        <button type="submit" className="btn btn-primary ml-2">Save</button>
      </div>
    </form>
  );
};

export default ProductForm;
