import React from 'react';
import styles from '../assets/css/component/FormModal.module.css';

const FormModal = (props) => {
  const modalWidth = props.width ? `${props.width}` : '90%';
  const modalHeight = props.height ? `${props.height}` : 'fit-content';
  const baseColor = props.baseColor
    ? `${props.baseColor}`
    : 'rgb(17, 16, 16)';

  return !props.show ? null : (
    <div
      className={styles.modal}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="formModalTitle"
    >
      <div
        className={styles.modalContent}
        style={{
          width: modalWidth,
          height: modalHeight,
          border: `1px solid ${baseColor}`,
        }}
      >
        <div
          className={styles.modalHeader}
          style={{ backgroundColor: baseColor }}
        >
          <span
            className={styles.close}
            onClick={() => props.handleClose()}
          >
            &times;
          </span>
          <h5 className="h4" id="formModalTitle">
            {props.moduleName}
          </h5>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default FormModal;
