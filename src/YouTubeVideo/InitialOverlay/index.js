import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material'; // Importa o CircularProgress
import './styles.css';
import { FaPlay } from 'react-icons/fa';

const InitialOverlay = ({ thumbnailUrl, onPlay, iconType }) => {
  const handleClick = () => {
    // Executa o onPlay somente se o iconType for 1 (Play)
    if (iconType === 1) {
      onPlay();
    }
  };

  const renderIcon = () => {
    switch (iconType) {
      case 1:
        return (
          <FaPlay color="white" size={40} className="play-icon" />
        );
      case 2:
        return (
          <div className="loading-spinner">
            <CircularProgress 
              size={55} 
              thickness={4} 
              color="inherit" 
              className="loading-loop" 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="initial-overlay" 
      onClick={handleClick} // Usando a função handleClick para condicionar o comportamento
      style={{ cursor: iconType === 1 ? 'pointer' : 'default' }} // Altera o cursor para pointer apenas se o ícone for de Play
    >
      <img src={thumbnailUrl} alt="Thumbnail" className="thumbnail" />
      {renderIcon()}
    </div>
  );
};

InitialOverlay.propTypes = {
  thumbnailUrl: PropTypes.string.isRequired,
  onPlay: PropTypes.func.isRequired,
  iconType: PropTypes.oneOf([0, 1, 2]), // 0: None, 1: Play, 2: Loading
};

InitialOverlay.defaultProps = {
  iconType: 1, // Padrão para o ícone de Play
};

export default InitialOverlay;
