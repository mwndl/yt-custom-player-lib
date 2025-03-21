import React from 'react';
import PropTypes from 'prop-types';
import PlayPauseButton from './PlayPauseButton';
import StopButton from './StopButton';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import FullscreenButton from './FullscreenButton'; // Novo componente
import LiveIndicator from './LiveIcon'; // Novo componente
import './styles.css';

const Controls = ({ 
  isPlaying, 
  onTogglePlayPause, 
  onStop, 
  progress,
  progressStart, 
  progressEnd, 
  volume, 
  isMuted, 
  onMuteToggle, 
  onVolumeChange, 
  showPlayPause,  
  showStop,
  showProgressBar, 
  showVolumeControl,
  onProgressBarClick,
  isLive,
  isFullscreen,
  onFullscreenToggle,
  showFullscreenButton,
}) => {
  return (
    <>
      {isLive && (
        <div className="controls-container top">
          <div className="right-controls">
            <LiveIndicator />
          </div>
        </div>
      )}

      <div className="controls-container bottom">
        <div className="left-controls">
          {showStop ? (
            <StopButton onStop={onStop} />
          ) : (
            showPlayPause && (
              <PlayPauseButton isPlaying={isPlaying} onTogglePlayPause={onTogglePlayPause} />
            )
          )}
        </div>

        {showProgressBar && (
          <div className="progress-bar-wrapper">
            <ProgressBar progress={progress} start={progressStart} end={progressEnd} onClick={onProgressBarClick} />
          </div>
        )}

        <div className="right-controls">
          {showVolumeControl && (
            <VolumeControl 
              volume={volume} 
              isMuted={isMuted} 
              onMuteToggle={onMuteToggle} 
              onVolumeChange={onVolumeChange} 
            />
          )}

          {showFullscreenButton && (
            <FullscreenButton isFullscreen={isFullscreen} onToggle={onFullscreenToggle} />
          )}
        </div>
      </div>
    </>
  );
};

Controls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onTogglePlayPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  isMuted: PropTypes.bool.isRequired,
  onMuteToggle: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  showPlayPause: PropTypes.bool,  
  showStop: PropTypes.bool, 
  showProgressBar: PropTypes.bool, 
  showVolumeControl: PropTypes.bool,
  onProgressBarClick: PropTypes.func.isRequired,
  isLive: PropTypes.bool,
  isFullscreen: PropTypes.bool.isRequired,
  onFullscreenToggle: PropTypes.func.isRequired,
};

Controls.defaultProps = {
  showPlayPause: true,
  showStop: false,
  showProgressBar: true,
  showVolumeControl: true,
  isLive: false,
};

export default Controls;
