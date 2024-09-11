import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/component/Sidebar.module.css'; // Import CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faQuestionCircle, faCalendarDay, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const SidebarBottom = () => {
  return (
    <div className={styles.sidebarButtons}>
      <Link to="/invite" className={styles.button}>
        <FontAwesomeIcon icon={faUserPlus} className={styles.icon} />
        Invite teammates
      </Link>
      <Link to="/help" className={styles.button}>
        <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        Help and first steps
      </Link>
      <span className={styles.button}>
        <FontAwesomeIcon icon={faCalendarDay} className={styles.icon} />
        7 Days Left on Trial
        <button className={styles.blackButton}>Billing</button>
      </span>
    </div>
  );
}

export default SidebarBottom;
