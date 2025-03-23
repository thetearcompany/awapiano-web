'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
    src?: string;
    title?: string;
    artist?: string;
}

export function AudioPlayerContainer({ src, title = 'Untitled', artist = 'Unknown Artist' }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => {
                audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, []);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-6 rounded-xl shadow-2xl max-w-md mx-auto text-white"
        >
            <audio ref={audioRef} src={src} />

            <div className="flex flex-col items-center space-y-4">
                <motion.div
                    animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: isPlaying ? Infinity : 0, duration: 2 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg"
                >
                    <span className="text-4xl">{isPlaying ? '🎵' : '♪'}</span>
                </motion.div>

                <div className="text-center">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-indigo-200">{artist}</p>
                </div>

                <div className="w-full space-y-2">
                    <div className="relative w-full h-2 bg-indigo-800 rounded-full">
                        <motion.div
                            className="absolute h-full bg-indigo-400 rounded-full"
                            style={{ width: `${progress}%` }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>{formatTime(duration * (progress / 100))}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={togglePlay}
                        className="bg-white text-indigo-900 rounded-full w-12 h-12 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
} 