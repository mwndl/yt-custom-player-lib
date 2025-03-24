import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import InitialOverlay from './components/InitialOverlay';
import Controls from './components/Controls/index';
import useYouTubePlayer from './hooks/useYouTubePlayer';

const YouTubeEmbed = ({
  videoId,
  start = 0,
  end = 0,
  autoplay = false,
  muted = false,
  repeat = false,
  showInicialOverlay = true,
  showPlayPauseBtn = true,
  showStopBtn = false,
  showMuteBtn = true,
  showProgressBar = true,
  aspectRatio = "16:9",
  fullScreen = true,
  live = false,
  action = null,
  onTimestampUpdate = null,
}) => {

  // forçamos mute para true caso autoplay esteja ativado por regras de privacidade dos navegadores.
  if (autoplay) muted = true;

  // controles de live ainda está estável, por isso desativamos play/pause e progress bar
  if (live) {
    showPlayPauseBtn = false;
    showProgressBar = false,
    showStopBtn = true;
  }

  const aspectRatios = {
    "4:3": 4 / 3,
    "16:9": 16 / 9,
    "21:9": 21 / 9,
    "9:16": 9 / 16,
    "1:1": 1 / 1,
  };

  const aspect = aspectRatios[aspectRatio] || aspectRatios["16:9"];
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showInitialOverlay, setShowInitialOverlay] = useState(showInicialOverlay === true);
  const [iconType, setIconType] = useState(2);

  const {
    videoRef,
    playerRef,
    isPlaying,
    isMuted,
    volume,
    setVolume,
    progress,
    videoDuration,
    loading,
    toggleMute,
    togglePlayPause,
    stopVideo,
    handleSeek,
  } = useYouTubePlayer({ videoId, start, end, autoplay, muted, repeat, live, action, onTimestampUpdate });

  // Verifica suporte ao fullscreen por parte do browser - iOS ainda não disponível
  useEffect(() => {
    if (fullScreen) {
      const fullscreenSupported =
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled;
  
      if (!fullscreenSupported) {
        console.warn("Fullscreen not supported on this browser. Hiding fullscreen button.");
        setIsFullscreenSupported(false);
      } else {
        setIsFullscreenSupported(true);
      }
    } else {
      setIsFullscreenSupported(false);
    }
  }, [fullScreen]);
  
  // Ouvinte para detectar mudanças no fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
  
      setIsFullscreen(!!isCurrentlyFullscreen);
    };
  
    // Adiciona o listener para mudanças de fullscreen
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
  
    // Limpeza do evento ao desmontar
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Alterna fullscreen
  const handleFullscreenToggle = () => {
    const container = containerRef.current;
  
    if (!container) {
      console.error("Container not found!");
      return;
    }
  
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };  

  // Inicia a reprodução inicial
  const handlePlayInitial = () => {
    if (playerRef.current) {
      handleSeekLive(); // Para vídeos ao vivo, fazemos um seek
      setIconType(2); // Atualiza o ícone para representar reprodução
      playerRef.current.playVideo(); // Inicia a reprodução
      setIsPlaying(true); // Define o estado de reprodução como verdadeiro
    }
  };
  
  // Mostra controles ao mover o mouse
  const handleMouseMove = () => {
    setShowControls(true); // Exibe os controles
    setShowLiveControl(true); // Exibe controles específicos para transmissão ao vivo
    clearTimeout(hideTimeoutRef.current); // Limpa o temporizador anterior
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false); // Oculta os controles após 3 segundos
      setShowLiveControl(false); // Oculta o controle ao vivo
    }, 3000); // Configura o tempo para esconder os controles
  };
  
  // Esconde controles ao sair com o mouse
  const handleMouseLeave = () => {
    clearTimeout(hideTimeoutRef.current); // Limpa o temporizador ao sair com o mouse
    setShowControls(false); // Esconde os controles
    setShowLiveControl(false); // Esconde o controle ao vivo
  };

  // Pula para o trecho ao vivo
  // Obs: A API do YT não atualiza a propriedade de duração a cada instante, por isso somamos +999 à duraçaõ atual
  const handleSeekLive = () => {
    if (live) {
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo((duration + 999), true);
    }
  }
  

  return (
    <div
      ref={containerRef}
      className="yt-video-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
      style={{ paddingBottom: `calc(100% / ${aspect})` }}
    >
      <div ref={videoRef} className="video"></div>
      <div
        className="overlay"
        onClick={showStopBtn ? stopVideo : showPlayPauseBtn && !loading ? togglePlayPause : undefined}
      ></div>

      {showInitialOverlay && (
        <InitialOverlay
          thumbnailUrl={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          onPlay={handlePlayInitial}
          iconType={iconType}
        />
      )}

      {showControls && (
        <Controls
          isPlaying={isPlaying}
          onTogglePlayPause={togglePlayPause}
          progress={progress}
          progressStart={start || 0}
          progressEnd={end || videoDuration}
          volume={volume}
          isMuted={isMuted}
          onMuteToggle={toggleMute}
          onVolumeChange={(e, newValue) => setVolume(newValue)}
          showPlayPause={showPlayPauseBtn}
          showStop={showStopBtn}
          onStop={stopVideo}
          showProgressBar={showProgressBar}
          showVolumeControl={showMuteBtn}
          onProgressBarClick={handleSeek}
          isLive={live}
          isFullscreen={isFullscreen}
          onFullscreenToggle={handleFullscreenToggle}
          showFullscreenButton={isFullscreenSupported}
        />
      )}
    </div>
  );
};

YouTubeEmbed.propTypes = {
  videoId: PropTypes.string.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  autoplay: PropTypes.bool,
  muted: PropTypes.bool,
  repeat: PropTypes.bool,
  showInicialOverlay: PropTypes.bool,
  showPlayPauseBtn: PropTypes.bool,
  showMuteBtn: PropTypes.bool,
  aspectRatio: PropTypes.string,
  fullScreen: PropTypes.bool,
  live: PropTypes.bool,
  action: PropTypes.string,
};

export default YouTubeEmbed;