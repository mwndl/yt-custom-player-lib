import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { Box, Slider, Stack } from '@mui/material';
import './styles.css';

const VolumeControl = ({ volume, isMuted, onMuteToggle, onVolumeChange }) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isSliderActive, setIsSliderActive] = useState(false);

  return (
    <div
      className="volumeControl"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => {
        if (!isSliderActive) {
          setShowVolumeSlider(false);
        }
      }}
    >
      <button onClick={onMuteToggle} className="muteButton">
        {isMuted ? <FaVolumeMute className="icon-size" /> : <FaVolumeUp className="icon-size" />}
      </button>
      <div className={`volumeSliderContainer ${showVolumeSlider ? 'visible' : ''}`}>
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%', // Mantém sempre acima do botão
            right: '50%',
            transform: 'translateX(50%)', // Centraliza horizontalmente
          }}
        >
          <Stack spacing={1} direction="column" sx={{ alignItems: 'center' }}>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              aria-label="Volume"
              min={0}
              max={100}
              orientation="vertical"
              onMouseDown={() => setIsSliderActive(true)}
              onMouseUp={() => setIsSliderActive(false)}
              sx={{
                height: 'clamp(60px, 10vw, 70px)',
                width: '5px',
                transition: 'all 0.3s ease',
                '& .MuiSlider-thumb': {
                  display: 'none',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#00c8ff',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ddd',
                },
              }}
            />
          </Stack>
        </Box>
      </div>
    </div>
  );
};

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  isMuted: PropTypes.bool.isRequired,
  onMuteToggle: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
};

export default VolumeControl;
