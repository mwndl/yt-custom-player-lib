import { useEffect, useRef, useState } from 'react';

const useYouTubePlayer = ({ videoId, start, end, autoplay, muted, repeat, live, action, onTimestampUpdate }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag para garantir que o componente está montado

    const loadYouTubeAPI = () => {
      if (typeof window.YT === 'undefined') {
        // Carregar a API do YouTube
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
        script.onload = () => {
          if (isMounted) {
            initializePlayer(); // Inicializa o player somente se o componente estiver montado
          }
        };
      } else {
        initializePlayer(); // Se a API já estiver carregada, inicializa o player diretamente
      }
    };

    const initializePlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new YT.Player(videoRef.current, {
          videoId,
          playerVars: {
            start,
            end,
            autoplay: autoplay ? 1 : 0,
            mute: muted ? 1 : 0,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
          },
        });
      }
    };

    const onPlayerReady = (event) => {
      if (isMounted) {
        playerRef.current = event.target;
        setVideoDuration(playerRef.current.getDuration());
        if (autoplay) {
          playerRef.current.playVideo();
        }
        setLoading(false);
      }
    };

    const onPlayerStateChange = (event) => {
      if (isMounted) {
        if (event.data === YT.PlayerState.ENDED && repeat) {
          playerRef.current.seekTo(start || 0);
          playerRef.current.playVideo();
        }
        setIsPlaying(event.data === YT.PlayerState.PLAYING);
      }
    };

    const onPlayerError = (event) => {
      console.error('YouTube Player Error:', event);
    };

    loadYouTubeAPI(); // Inicia o carregamento da API

    return () => {
      isMounted = false; // Marca o componente como desmontado quando o efeito for limpo
    };
  }, [videoId, start, end, autoplay, muted, repeat]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (action && playerRef.current) {
      switch (action) {
        case 'play':
          playerRef.current.playVideo();
          break;
        case 'pause':
          playerRef.current.pauseVideo();
          break;
        case 'stop':
          playerRef.current.stopVideo();
          break;
        case 'mute':
          playerRef.current.mute();
          setIsMuted(true);
          break;
        case 'unmute':
          playerRef.current.unMute();
          setIsMuted(false);
          break;
        default:
          break;
      }
    }
  }, [action]);

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const stopVideo = () => {
    if (playerRef.current) {
      playerRef.current.stopVideo();
      setIsPlaying(false);
    }
  };

  const handleSeek = (event) => {
    if (playerRef.current) {
      const seekTime = (event.target.value / 100) * videoDuration;
      playerRef.current.seekTo(seekTime, true);
    }
  };

  return {
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
  };
};

export default useYouTubePlayer;
