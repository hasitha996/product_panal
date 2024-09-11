import React, { useState, useEffect } from 'react';
import FormModal from './FormModal'; // Import Modal component
import styles from '../assets/css/component/Profile.module.css'; // Profile page styles
import apiService from '../services/api.service'; // Import service
import authService from '../services/auth.service'; 
import msgService from '../services/msg.service'; 

const Profile = ({ showModal, onClose }) => {
  const [user, setUser] = useState({});
  const [newEntity, setNewEntity] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile_picture: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = authService.getCurrentUser(); // Get current user details
        if (currentUser && currentUser.id) {
          const response = await apiService.get(`/users_det/${currentUser.id}`); // Fetch user details
          setUser(response);
 
          setNewEntity({
            id: currentUser.id|| '',
            first_name: response.firstName || '',
            last_name: response.lastName || '',
            email: response.email || '',
            password: '',
            profile_picture: null,
          });
        }
      } catch (err) {
        console.error('Error fetching user details', err);
        msgService.error('Failed to fetch user details.');
      }
    };

    if (showModal) {
      fetchUserDetails();
    }
  }, [showModal]);

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setNewEntity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewEntity((prev) => ({
      ...prev,
      profile_picture: e.target.files[0], // Get the selected file
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', newEntity.id);
    formData.append('first_name', newEntity.first_name);
    formData.append('last_name', newEntity.last_name);
    formData.append('email', newEntity.email);
    if (newEntity.password) {
      formData.append('password', newEntity.password);
    }
    if (newEntity.profile_picture) {
      formData.append('profile_picture', newEntity.profile_picture); // Add file to form data
    }

    try {
      await apiService.upload('/users/update', formData); // Use the upload method from apiService
      msgService.success('Profile updated successfully!');
      onClose(); // Close the modal after saving
    } catch (err) {
      console.error('Error updating profile', err);
      msgService.error('Failed to update profile.');
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.profilePage}>
          <FormModal
            moduleName="Profile"
            show={showModal}
            handleClose={onClose}
            toggleFormModal={onClose}
            width="400px"
          >
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="modal-body">
                <div className="row">
                  <div className="col-8">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="form-control form-control-sm"
                        value={newEntity.first_name}
                        onChange={handleValueChange}
                        maxLength="100"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-8">
                    <div className="form-group">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="form-control form-control-sm"
                        value={newEntity.last_name}
                        onChange={handleValueChange}
                        maxLength="50"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control form-control-sm"
                        value={newEntity.email}
                        onChange={handleValueChange}
                        readOnly="readOnly"
                        maxLength="50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div className="row">
                  <div className="col-8">
                    <div className="form-group">
                      <label htmlFor="profile_picture">Profile Picture</label>
                      <input
                        type="file"
                        name="profile_picture"
                        id="profile_picture"
                        className="form-control form-control-sm"
                        accept="image/*" // Only accept images
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <br />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </FormModal>
        </div>
      )}
    </>
  );
};

export default Profile;
