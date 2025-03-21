import React from 'react';
import PropTypes from 'prop-types';
import { FaStop } from 'react-icons/fa';
import styles from './StopButton.module.css'; // Importa o CSS Module

const StopButton = ({ onStop }) => {
  return (
    <button onClick={onStop} className={styles.stopButton}>
      <FaStop className={styles.iconSize} />
    </button>
  );
};

StopButton.propTypes = {
  onStop: PropTypes.func.isRequired,
};

export default StopButton;
