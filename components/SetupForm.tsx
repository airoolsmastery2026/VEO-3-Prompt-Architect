import React, { useState } from 'react';
import { ProjectSettings, CharacterBible, AspectRatio, CinematicStyle } from '../types';
import { Settings, Users, Clapperboard, Sparkles, BookOpen } from 'lucide-react';

interface SetupFormProps {
  settings: ProjectSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProjectSettings>>;
  bible: CharacterBible;
  setBible: React.Dispatch<React.SetStateAction<CharacterBible>>;
  onGenerate: () => void;
  onGenerateScript: () => Promise<void>;
  isGenerating: boolean;
  isWritingScript: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({
  settings,
  setSettings,
  bible,
  setBible,
  onGenerate,
  onGenerateScript,
  isGenerating,
  isWritingScript
}) => {
  const handleChange = (field: keyof ProjectSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleBibleChange = (field: keyof CharacterBible, value: string) => {
    setBible(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-2 text-cinema-500 mb-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-bold text-white">1. Settings / Thiết lập</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Story & Settings */}
        <div className="space-y-6">
          
          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Context / Bối cảnh</label>
            <textarea
              value={settings.context}
              onChange={(e) => handleChange('context', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-20 placeholder-slate-600"
              placeholder="E.g., Deep ocean, steampunk submarine..."
            />
          </div>

          {/* Video Idea & Auto-Write */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Video Idea / Ý tưởng</label>
            <textarea
              value={settings.videoIdea}
              onChange={(e) => handleChange('videoIdea', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-20 placeholder-slate-600"
              placeholder="Short summary of the plot..."
            />
            
            <button
                onClick={onGenerateScript}
                disabled={isWritingScript || !settings.videoIdea}
                className="w-full py-2.5 bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-white shadow transition flex items-center justify-center space-x-2 border border-violet-500/30"
            >
                {isWritingScript ? (
                   <>
                     <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                     <span>AI is Writing Story...</span>
                   </>
                ) : (
                   <>
                     <Sparkles className="w-3 h-3 text-violet-300" />
                     <span>Draft Full Story with AI (Viết cốt truyện)</span>
                   </>
                )}
            </button>
          </div>

          {/* Full Script Input */}
          <div className="relative group">
            <div className="flex items-center justify-between mb-1">
                 <label className="block text-sm font-medium text-slate-400">Full Script / Cốt truyện chi tiết</label>
                 <BookOpen className="w-3 h-3 text-slate-500" />
            </div>
            <textarea
              value={settings.script || ''}
              onChange={(e) => handleChange('script', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-32 font-serif text-slate-300 placeholder-slate-600 leading-relaxed"
              placeholder="Generated story will appear here. This narrative will be used to break down into 8s scenes..."
            />
          </div>

          {/* Tech Specs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">Genre</label>
              <select
                value={settings.style}
                onChange={(e) => handleChange('style', e.target.value as CinematicStyle)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cinema-500"
              >
                {Object.values(CinematicStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">Ratio</label>
              <select
                value={settings.ratio}
                onChange={(e) => handleChange('ratio', e.target.value as AspectRatio)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cinema-500"
              >
                {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
             <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-400 mb-1">No. Scenes</label>
              <input
                type="number"
                min={1}
                max={20}
                value={settings.sceneCount}
                onChange={(e) => handleChange('sceneCount', parseInt(e.target.value))}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cinema-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Character Bible */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-300 border-b border-cinema-700 pb-2">
             <Users className="w-4 h-4" />
             <span className="text-sm font-semibold">Character Bible / Hồ sơ nhân vật</span>
          </div>
          
          <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">English (Required)</label>
                <textarea
                value={bible.english}
                onChange={(e) => handleBibleChange('english', e.target.value)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs md:text-sm font-mono focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-64 resize-y"
                placeholder="Name, Age, Appearance, Outfit..."
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Vietnamese (Optional)</label>
                <textarea
                value={bible.vietnamese}
                onChange={(e) => handleBibleChange('vietnamese', e.target.value)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs md:text-sm font-mono focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-40 resize-y"
                placeholder="Tên, Tuổi, Ngoại hình, Trang phục..."
                />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full py-4 mt-6 bg-gradient-to-r from-cinema-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white shadow-lg transform transition active:scale-[0.99] flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
             <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
             <span>Đang tạo Storyboard (Generating)...</span>
          </>
        ) : (
          <>
            <Clapperboard className="w-5 h-5" />
            <span>Generate Storyboard ({settings.sceneCount} Scenes)</span>
          </>
        )}
      </button>
    </div>
  );
};