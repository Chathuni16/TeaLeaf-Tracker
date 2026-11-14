import { useState, useEffect, useRef, useCallback } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useSettings } from '../context/SettingsContext';

// Ensure notifications show even when app is active in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useBrewTimer = (initialMinutes: number, teaTypeName: string = 'Tea') => {
  const { notificationsEnabled } = useSettings();
  const totalSeconds = Math.round(initialMinutes * 60);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Store target end timestamp for drift-free countdown
  const endTimeRef = useRef<number | null>(null);
  const remainingOnPauseRef = useRef<number>(totalSeconds);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when initial duration changes
  useEffect(() => {
    reset(Math.round(initialMinutes * 60));
  }, [initialMinutes]);

  const clearTimerInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const onTimerFinished = useCallback(async () => {
    clearTimerInterval();
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(true);
    setRemainingSeconds(0);

    // Release screen keep-awake
    try {
      await deactivateKeepAwake();
    } catch {
      // Ignored
    }

    // Trigger haptic feedback
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics fallback
    }

    // Trigger local notification if enabled
    if (notificationsEnabled) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${teaTypeName} is ready! 🍃`,
            body: 'Steeping time is complete. Remove leaves to enjoy perfect flavour.',
            sound: true,
          },
          trigger: null, // deliver immediately
        });
      } catch {
        // Notification fallback
      }
    }
  }, [notificationsEnabled, teaTypeName]);

  const start = useCallback(async () => {
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);

    // Keep screen awake while timer runs
    try {
      await activateKeepAwakeAsync();
    } catch {
      // Fallback
    }

    const duration = remainingOnPauseRef.current;
    endTimeRef.current = Date.now() + duration * 1000;

    clearTimerInterval();
    timerIntervalRef.current = setInterval(() => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const diffMs = endTimeRef.current - now;
      const nextSeconds = Math.max(0, Math.ceil(diffMs / 1000));

      setRemainingSeconds(nextSeconds);

      if (nextSeconds <= 0) {
        onTimerFinished();
      }
    }, 250);
  }, [onTimerFinished]);

  const pause = useCallback(async () => {
    clearTimerInterval();
    setIsRunning(false);
    setIsPaused(true);
    remainingOnPauseRef.current = remainingSeconds;

    try {
      await deactivateKeepAwake();
    } catch {
      // Ignored
    }
  }, [remainingSeconds]);

  const reset = useCallback(
    async (customSeconds?: number) => {
      clearTimerInterval();
      const secs = customSeconds !== undefined ? customSeconds : totalSeconds;
      remainingOnPauseRef.current = secs;
      endTimeRef.current = null;
      setRemainingSeconds(secs);
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(false);

      try {
        await deactivateKeepAwake();
      } catch {
        // Ignored
      }
    },
    [totalSeconds]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
      deactivateKeepAwake().catch(() => {});
    };
  }, []);

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    totalSeconds,
    remainingSeconds,
    formattedTime,
    progress,
    isRunning,
    isPaused,
    isCompleted,
    start,
    pause,
    reset,
  };
};
