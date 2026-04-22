"use client";
import { useState, useEffect } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState('default');
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermissionAndUnlockAudio = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }

    try {
      const audio = new Audio('/alarma.mp3');
      audio.volume = 0.1; 
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      setAudioUnlocked(true);
    } catch (error) {
      console.log("Se requiere interacción para el audio");
    }
  };

  const playTestAlert = () => {
    if (permission === 'granted') {
      const audio = new Audio('/alarma.mp3');
      audio.volume = 1.0;
      audio.play();
      
      new Notification('¡Prueba de PSC INFORMA!', {
        body: 'Así sonarán las alertas de emergencia en Fabulosa Play.',
        vibrate: [200, 100, 200]
      });
    } else {
      alert("Primero debes aceptar los permisos.");
    }
  };

  return { permission, audioUnlocked, requestPermissionAndUnlockAudio, playTestAlert };
}