import React from 'react';
import PropTypes from 'prop-types';
import { FaExpand, FaCompress } from 'react-icons/fa';
import './styles.css';

const FullscreenButton = ({ isFullscreen, onToggle }) => {
  return (
    <div className="fullscreen" >
        <button 
        onClick={onToggle} 
        className="fullscreen-button" 
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
        {isFullscreen ? <FaCompress className="icon-size" /> : <FaExpand className="icon-size" />}
        </button>
    </div>
  );
};

FullscreenButton.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FullscreenButton;
