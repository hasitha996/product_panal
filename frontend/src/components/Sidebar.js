import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faBullhorn, faPencilRuler, faBoxOpen, faCode, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from '../assets/css/component/Sidebar.module.css';
import ProfileImage from "../assets/images/profile.png";
import Logo from '../assets/images/logo.png';
import authService from '../services/auth.service';
import Profile from './Profile';
import SidebarBottom from './SidebarBottom';

const Sidebar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({}); // Handle multiple expandable menus

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleProfile = () => {
    if(menuVisible){
      toggleMenu();
    } 
    setProfileVisible(!profileVisible);
  };

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response) {
        navigate("/");
        window.location.reload();
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  // Toggle folder or menu expansion
  const toggleExpandedFolder = (folderName) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <img src={Logo} alt="Company Logo" className={styles.logo} />
        <span className={styles.companyName}>Abc company</span>
        <div className={styles.userSection}>
          <img
            src={ProfileImage}
            alt="User"
            className={styles.userImage}
            onClick={toggleMenu}
          />
        </div>
      </div>

      <div className={styles.sidebarLinks}>
        {/* Home link */}
        <Link to="/" className={styles.sidebarLink}>
          <FontAwesomeIcon icon={faPencilRuler} className={styles.iconLeft} />
          Design Team
        </Link>

        <Link to="/" className={styles.sidebarLink}>
          <FontAwesomeIcon icon={faBullhorn} className={styles.iconLeft} />
          Marketing Team
        </Link>

        <Link to="/" className={styles.sidebarLink}>
          <FontAwesomeIcon icon={faCode} className={styles.iconLeft} />
          Development Team
        </Link>
        {/* Expandable Products Folder */}
        <div className={styles.sidebarExpandable}>

          {/* Folder Main with Expandable Subfolders */}

          <div className={styles.sidebarLink} onClick={() => toggleExpandedFolder('folder')}>
            <FontAwesomeIcon icon={faFolder} className={styles.iconLeft} />
            Folders
            <FontAwesomeIcon
              icon={expandedFolders['folder'] ? faChevronDown : faChevronRight}
              className={styles.iconRight}
            />
          </div>

          {/* Subfolders under Folder Main */}
          {expandedFolders['folder'] && (
            <div className={styles.subMenu}>

              {/* Products Folder */}
              <div className={styles.sidebarExpandable}>
                <div className={styles.sidebarLink} onClick={() => toggleExpandedFolder('products')}>
                  <FontAwesomeIcon icon={faBoxOpen} className={styles.iconLeft} />
                  Products
                  <FontAwesomeIcon
                    icon={expandedFolders['products'] ? faChevronDown : faChevronRight}
                    className={styles.iconRight}
                  />
                </div>

                {/* Subcategories under Products */}
                {expandedFolders['products'] && (
                  <div className={styles.subMenu}>
                    <Link to="" className={styles.sidebarLink}>
                      Roadmap
                    </Link>
                    <Link to="" className={styles.sidebarLink}>
                      Feedback
                    </Link>
                    <Link to="" className={styles.sidebarLink}>
                      Performance
                    </Link>
                    <Link to="" className={styles.sidebarLink}>
                      Team
                    </Link>
                    <Link to="" className={styles.sidebarLink}>
                      Analytics
                    </Link>
                  </div>
                )}
              </div>

              {/* Sales Folder */}
              <div className={styles.sidebarExpandable}>
                <div className={styles.sidebarLink} onClick={() => toggleExpandedFolder('sales')}>
                  <FontAwesomeIcon icon={faFolder} className={styles.iconLeft} />
                  Sales
                  <FontAwesomeIcon
                    icon={expandedFolders['sales'] ? faChevronDown : faChevronRight}
                    className={styles.iconRight}
                  />
                </div>
              </div>

              {/* Design Folder */}
              <div className={styles.sidebarExpandable}>
                <div className={styles.sidebarLink} onClick={() => toggleExpandedFolder('design')}>
                  <FontAwesomeIcon icon={faFolder} className={styles.iconLeft} />
                  Design
                  <FontAwesomeIcon
                    icon={expandedFolders['design'] ? faChevronDown : faChevronRight}
                    className={styles.iconRight}
                  />
                </div>
              </div>

              {/* Office Folder */}
              <div className={styles.sidebarExpandable}>
                <div className={styles.sidebarLink} onClick={() => toggleExpandedFolder('office')}>
                  <FontAwesomeIcon icon={faFolder} className={styles.iconLeft} />
                  Office
                </div>
              </div>

              {/* Legal Folder */}
              <div className={styles.sidebarExpandable}>
                <div className={styles.sidebarLink} onClick={() => toggleExpandedFolder('legal')}>
                  <FontAwesomeIcon icon={faFolder} className={styles.iconLeft} />
                  Legal
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {menuVisible && (
        <div className={styles.popupMenu}>
          <a href="#!" className={styles.popupLink} onClick={toggleProfile}>Profile</a>
          <a href="#!" className={styles.popupLink} onClick={handleLogout}>Logout</a>
        </div>
      )}
      <SidebarBottom />
      <Profile showModal={profileVisible} onClose={toggleProfile} />
    </div>
  );
};

export default Sidebar;
