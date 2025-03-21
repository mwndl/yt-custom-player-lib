import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import InitialOverlay from './InitialOverlay';
import Controls from './Controls/index';

const YouTubeEmbed = ({
  videoId,
  start,
  end,
  autoplay,
  muted,
  repeat,
  showInicialOverlay,
  showPlayPauseBtn,
  showStopBtn,
  showMuteBtn,
  showProgressBar,
  aspectRatio,
  fullScreen,
  live,
  action,
  onTimestampUpdate, // adicionando prop para o callback do timestamp
}) => {

  // caso o CMS forneça autoplay true e muted false, o navegador não deixará o vídeo ser reproduzido
  // essa validação força o muted para true quando autoplay for true para reproduzir o vídeo
  if (autoplay) {
    muted = true
  }

  // lives não suportam tão bem funções de seek
  if (live) {
    showPlayPauseBtn = false
    showStopBtn = true
  }

  const aspectRatios = {
    "4:3": 4 / 3,
    "16:9": 16 / 9,
    "21:9": 21 / 9,
    "9:16": 9 / 16,
    "1:1": 1 / 1,
  };

  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);
  const aspect = aspectRatios[aspectRatio] || aspectRatios["16:9"];

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [showLiveControl, setShowLiveControl] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [volume, setVolume] = useState(75);
  const playerRef = useRef(null);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [showInitialOverlay, setShowInitialOverlay] = useState(showInicialOverlay === true);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iconType, setIconType] = useState(loading ? 2 : 0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);



  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(videoRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          enablejsapi: 1,
          start: start,
          end: end || undefined,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            setLoading(false);

            if (muted) {
              event.target.mute();
              setIsMuted(true);
            } else {
              event.target.setVolume(volume);
              setIsMuted(false);
            }
            event.target.setVolume(volume);
            if (autoplay) {
              event.target.playVideo();
            }
            const duration = event.target.getDuration();
            setVideoDuration(duration);
            if (autoplay && muted) {
              setIconType(2);
            } else {
              setIconType(1);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (repeat) {
                event.target.seekTo(start);
                event.target.playVideo();
              }
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }

            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);

              setTimeout(() => {
                setShowInitialOverlay(false);
              }, 750);
            }

            if (end > 0 && event.target.getCurrentTime() >= end) {
              event.target.pauseVideo();
              event.target.seekTo(start);
            }
          },
        },
      });

      const interval = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = (end || videoDuration) - start;
          if (duration > 0) {
            const adjustedCurrentTime = currentTime - start;
            if (adjustedCurrentTime >= 0) {
              setProgress((adjustedCurrentTime / duration) * 100);

              // Aqui, chamamos o callback onTimestampUpdate com o timestamp atual
              if (onTimestampUpdate) {
                onTimestampUpdate(adjustedCurrentTime); // Passa o timestamp atual
              }
            }
          }
        }
      }, 1000);


      return () => clearInterval(interval);
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, start, end, autoplay, muted, videoDuration]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
      setIsMuted(volume === 0);
    }
  }, [volume]);

  // Verifica suporte ao fullscreen apenas se a prop fullScreen for verdadeira
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


  // ações de controle dinâmicas via prop
  useEffect(() => {
    if (!action || !playerRef.current) return; // Se nenhuma ação for passada, não faz nada

    const player = playerRef.current;

    switch (action) {
      case 'play':
        if (live) {
          handleSeekLive();
          player.playVideo();
          setIsPlaying(true);
        } else {
          player.playVideo();
          setIsPlaying(true);
        }
        break;

      case 'pause':
        player.pauseVideo();
        setIsPlaying(false);
        break;

      case 'mute':
        player.mute();
        setIsMuted(true);
        break;

      case 'unmute':
        player.unMute();
        setIsMuted(false);
        break;

      case 'togglePlayPause':
        if (isPlaying) {
          player.pauseVideo();
          setIsPlaying(false);
        } else {
          player.playVideo();
          setIsPlaying(true);
        }
        break;

      case 'toggleMute':
        if (isMuted) {
          player.unMute();
          setIsMuted(false);
        } else {
          player.mute();
          setIsMuted(true);
        }
        break;

      default:
        console.warn(`Ação desconhecida: ${action}`);
        break;
    }
  }, [action]);

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


  // ouvintes de evento para atualizar o estado do fullscreen caso o usuário saia via ESC
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



  const toggleMute = () => {
    const player = playerRef.current;
    if (player) {
      if (isMuted) {
        player.unMute();
        player.setVolume(previousVolume);
        setVolume(previousVolume);
      } else {
        setPreviousVolume(volume);
        player.mute();
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    const player = playerRef.current;
    if (player) {
      setUserInteracted(true);
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleToggleControls = () => {
    setShowControls(true);
    clearTimeout(window.hideControlsTimeout); // Cancela qualquer temporizador anterior
    window.hideControlsTimeout = setTimeout(() => {
      setShowControls(false);
    }, 3000); // Oculta os controles após 3 segundos
  };

  const handleVolumeChange = (event, newValue) => {
    const player = playerRef.current;
    if (isMuted) {
      player.unMute();
    }
    setVolume(newValue);
  };

  const stopVideo = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      setShowInitialOverlay(true);
      setIconType(1);
    }
  };

  const handleSeekLive = () => {
    if (live) {
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo((duration + 999), true);
    }
  }

  const handlePlayInitial = () => {
    if (playerRef.current) {
      handleSeekLive();
      setIconType(2);
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleSeek = (event) => {
    const { clientWidth } = event.currentTarget;
    const clickX = event.nativeEvent.offsetX;
    const newProgress = (clickX / clientWidth) * 100;

    const duration = (end || videoDuration) - start;
    const newTime = (newProgress / 100) * duration + start;

    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };


  // Detecta movimento do mouse dentro do contêiner
  const handleMouseMove = () => {
    setShowControls(true);
    setShowLiveControl(true); // Mostra o LiveControl quando o mouse se move
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowLiveControl(false); // Oculta o LiveControl após 3 segundos sem movimento
    }, 3000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hideTimeoutRef.current);
    setShowControls(false);
    setShowLiveControl(false); // Oculta o LiveControl quando o mouse sai
  };

  return (
    <div
      ref={containerRef}
      className="yt-video-container"
      onMouseMove={handleMouseMove} // Movimento do mouse
      onMouseLeave={handleMouseLeave} // Saída do mouse
      onClick={handleToggleControls} // Mobile e Desktop
      onTouchStart={handleToggleControls} // Mobile
      style={{ paddingBottom: `calc(100% / ${aspect})` }}
    >
      <div ref={videoRef} className="video"></div>
      <div
        className="overlay"
        onClick={
          showStopBtn
            ? stopVideo  // Aqui acionamos a função stopVideo ao clicar no overlay
            : showPlayPauseBtn === true && !loading
              ? togglePlayPause
              : undefined
        }
      ></div>

      {showInitialOverlay && (
        <InitialOverlay
          thumbnailUrl={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          onPlay={handlePlayInitial}
          iconType={iconType}
        />
      )}

      {/* showControls */}
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
          onVolumeChange={handleVolumeChange}
          showPlayPause={showPlayPauseBtn === true}
          showStop={showStopBtn === true}
          onStop={stopVideo}
          showProgressBar={showProgressBar === true}
          showVolumeControl={showMuteBtn === true}
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
  thumbnailUrl: PropTypes.string.isRequired,
  fullScreen: PropTypes.bool,
  live: PropTypes.bool,
  action: PropTypes.string,
};

YouTubeEmbed.defaultProps = {
  start: 0,
  end: 0,
  autoplay: false,
  muted: false,
  repeat: false,
  showInicialOverlay: true,
  showPlayPauseBtn: true,
  showMuteBtn: true,
  showProgressBar: true,
  aspectRatio: "16:9",
  fullScreen: true,
  live: false,
  action: null,
  onTimestampUpdate: null,
};

export default YouTubeEmbed;