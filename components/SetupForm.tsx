import React from 'react';
import { ProjectSettings, CharacterBible, AspectRatio, CinematicStyle } from '../types';
import { Settings, Users, Film, Clapperboard, MonitorPlay } from 'lucide-react';

interface SetupFormProps {
  settings: ProjectSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProjectSettings>>;
  bible: CharacterBible;
  setBible: React.Dispatch<React.SetStateAction<CharacterBible>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({
  settings,
  setSettings,
  bible,
  setBible,
  onGenerate,
  isGenerating
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Basic Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Context / Bối cảnh</label>
            <textarea
              value={settings.context}
              onChange={(e) => handleChange('context', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-20"
              placeholder="Deep ocean, steampunk submarine..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Video Idea / Ý tưởng</label>
            <textarea
              value={settings.videoIdea}
              onChange={(e) => handleChange('videoIdea', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-20"
              placeholder="Summarize the plot..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Genre / Thể loại</label>
              <select
                value={settings.style}
                onChange={(e) => handleChange('style', e.target.value as CinematicStyle)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-cinema-500"
              >
                {Object.values(CinematicStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Ratio / Tỉ lệ</label>
              <select
                value={settings.ratio}
                onChange={(e) => handleChange('ratio', e.target.value as AspectRatio)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-cinema-500"
              >
                {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          
           <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">No. Scenes / Số cảnh</label>
              <input
                type="number"
                min={1}
                max={20}
                value={settings.sceneCount}
                onChange={(e) => handleChange('sceneCount', parseInt(e.target.value))}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-cinema-500"
              />
            </div>
        </div>

        {/* Right Column: Character Bible */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-300">
             <Users className="w-4 h-4" />
             <span className="text-sm font-semibold">Character Bible / Hồ sơ nhân vật</span>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">English (Required)</label>
            <textarea
              value={bible.english}
              onChange={(e) => handleBibleChange('english', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs md:text-sm font-mono focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-40"
              placeholder="Name, Age, Appearance, Outfit..."
            />
          </div>

          <div>
             <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">Vietnamese (Optional)</label>
            <textarea
              value={bible.vietnamese}
              onChange={(e) => handleBibleChange('vietnamese', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs md:text-sm font-mono focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-40"
              placeholder="Tên, Tuổi, Ngoại hình, Trang phục..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full py-4 bg-gradient-to-r from-cinema-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white shadow-lg transform transition active:scale-[0.99] flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
             <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
             <span>Generating Storyboard...</span>
          </>
        ) : (
          <>
            <Clapperboard className="w-5 h-5" />
            <span>Generate Storyboard Scenes</span>
          </>
        )}
      </button>
    </div>
  );
};
