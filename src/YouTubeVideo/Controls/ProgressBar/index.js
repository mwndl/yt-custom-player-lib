import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const formatTime = (seconds) => {
  if (seconds < 0) return "00:00"; // Se o tempo for negativo, retorna o valor fixo

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':'); // Formato hh:mm:ss
  } else {
    return [m, s].map(v => String(v).padStart(2, '0')).join(':'); // Formato mm:ss
  }
};



const ProgressBar = ({ progress, start = 0, end = 100, onClick }) => {
  const [hoverTime, setHoverTime] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percentage = relativeX / rect.width;
    const newStart = 0;
    const duration = end - start;

    const hoveredTime = newStart + percentage * duration;

    setHoverTime(formatTime(hoveredTime));

    // Limita a posição do tooltip dentro da barra
    const clampedPosition = Math.max(10, Math.min(relativeX, rect.width - 10));
    setTooltipPosition(clampedPosition);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  return (
    <div
      className="progress-bar-container"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="progress-bar-background">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      {hoverTime && (
        <div
          className="progress-tooltip"
          style={{ left: `${tooltipPosition}px` }}
        >
          {hoverTime}
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default ProgressBar;
