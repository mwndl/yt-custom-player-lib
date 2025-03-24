import React from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaPause } from 'react-icons/fa';
import './styles.css'

const PlayPauseButton = ({ isPlaying, onTogglePlayPause }) => {
  return (
    <button onClick={onTogglePlayPause} className="playPauseButton">
      {isPlaying ? <FaPause className="icon-size" /> : <FaPlay className="icon-size" />}
    </button>
  );
};

PlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onTogglePlayPause: PropTypes.func.isRequired,
};

export default PlayPauseButton;
