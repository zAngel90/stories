'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Story } from '@/types/story';
import StoryViewer from './StoryViewer';

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadStories = () => {
      const storedStories = localStorage.getItem('stories');
      if (storedStories) {
        const parsedStories = JSON.parse(storedStories);
        const validStories = parsedStories.filter((story: Story) => {
          const storyTime = new Date(story.timestamp).getTime();
          const now = new Date().getTime();
          return now - storyTime < 24 * 60 * 60 * 1000;
        });
        setStories(validStories);
        localStorage.setItem('stories', JSON.stringify(validStories));
      }
    };

    loadStories();
    const interval = setInterval(loadStories, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, sube solo imágenes');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      
      const newStory: Story = {
        id: Date.now().toString(),
        imageUrl: base64,
        timestamp: new Date().toISOString(),
      };

      const updatedStories = [...stories, newStory];
      setStories(updatedStories);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteStory = (storyId: string) => {
    const updatedStories = stories.filter(story => story.id !== storyId);
    setStories(updatedStories);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
  };

  return (
    <div className="story-container">
      {/* Botón de agregar historia */}
      <div className="flex-shrink-0">
        <label className="story-add-button">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </label>
        <p className="text-xs text-center mt-1 text-gray-500">Nueva</p>
      </div>

      {/* Lista de historias */}
      {stories.map((story, index) => (
        <div key={story.id} className="flex-shrink-0 flex flex-col items-center">
          <button
            className="story-ring"
            onClick={() => setSelectedStoryIndex(index)}
          >
            <div className="w-[70px] h-[70px] rounded-full p-[2px] bg-white">
              <Image
                src={story.imageUrl}
                alt="Story thumbnail"
                width={70}
                height={70}
                className="rounded-full object-cover"
              />
            </div>
          </button>
          <p className="text-xs text-center mt-1 text-gray-500">
            {new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ))}

      {/* Visor de historias */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          story={stories[selectedStoryIndex]}
          onClose={() => setSelectedStoryIndex(null)}
          onNext={() => {
            if (selectedStoryIndex < stories.length - 1) {
              setSelectedStoryIndex(selectedStoryIndex + 1);
            } else {
              setSelectedStoryIndex(null);
            }
          }}
          onPrev={() => {
            if (selectedStoryIndex > 0) {
              setSelectedStoryIndex(selectedStoryIndex - 1);
            }
          }}
          onDelete={() => handleDeleteStory(stories[selectedStoryIndex].id)}
        />
      )}
    </div>
  );
};

export default StoryList;
