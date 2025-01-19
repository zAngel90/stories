'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Story } from '@/types/story';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onDelete?: (storyId: string) => void;
  duration?: number;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ 
  story, 
  onClose, 
  onNext, 
  onPrev,
  onDelete,
  duration = 5
}) => {
  const [progress, setProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const storyIdRef = useRef(story.id);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50; // Distancia mínima para considerar un swipe

  const handleNext = useCallback(() => {
    if (onNext && !showDeleteConfirm) {
      onNext();
    }
  }, [onNext, showDeleteConfirm]);

  const handlePrev = useCallback(() => {
    if (onPrev && !showDeleteConfirm) {
      onPrev();
    }
  }, [onPrev, showDeleteConfirm]);

  // Manejadores de eventos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    const isSignificantSwipe = Math.abs(swipeDistance) > minSwipeDistance;

    if (isSignificantSwipe) {
      if (swipeDistance > 0 && onPrev) {
        handlePrev();
      } else if (swipeDistance < 0 && onNext) {
        handleNext();
      }
    }

    // Reiniciar valores
    touchStartX.current = 0;
    touchEndX.current = 0;
    setIsPaused(false);
  };

  // Reiniciar progreso cuando cambia la historia
  useEffect(() => {
    if (storyIdRef.current !== story.id) {
      setProgress(0);
      storyIdRef.current = story.id;
    }
  }, [story.id]);

  // Manejar teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDeleteConfirm) return;
      
      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose, showDeleteConfirm]);

  // Manejar progreso y cambio automático
  useEffect(() => {
    if (isPaused || showDeleteConfirm) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (duration * 20));
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [duration, handleNext, isPaused, showDeleteConfirm]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(story.id);
      onClose();
    }
  }, [onDelete, story.id, onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="w-full max-w-md relative">
        {/* Barra de progreso */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 z-20">
          <div 
            className="h-full bg-white transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Botones superiores */}
        <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
          {/* Botón de eliminar */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-white hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenedor de imagen y navegación */}
        <div className="relative">
          {/* Imagen de la historia */}
          <div 
            className="relative aspect-[9/16] w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Image
              src={story.imageUrl}
              alt="Story"
              fill
              className="object-cover rounded-lg"
              draggable={false}
            />
          </div>

          {/* Botones de navegación */}
          {onPrev && (
            <button
              onClick={handlePrev}
              className="navigation-button prev hidden md:flex"
              aria-label="Historia anterior"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          
          {onNext && (
            <button
              onClick={handleNext}
              className="navigation-button next hidden md:flex"
              aria-label="Siguiente historia"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Eliminar historia?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
