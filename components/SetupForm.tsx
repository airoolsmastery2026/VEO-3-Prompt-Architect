
import React, { useState } from 'react';
import { ProjectSettings, CharacterBible, AspectRatio, CinematicStyle } from '../types';
import { Settings, Users, Clapperboard, Sparkles, BookOpen, Wand2, Lightbulb, PackageOpen, UserPlus, Eraser, ChevronDown, ChevronUp } from 'lucide-react';

interface SetupFormProps {
  settings: ProjectSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProjectSettings>>;
  bible: CharacterBible;
  setBible: React.Dispatch<React.SetStateAction<CharacterBible>>;
  onGenerate: () => void;
  onGenerateScript: () => Promise<void>;
  onSuggestTitle: () => Promise<void>;
  onSuggestContext: () => Promise<void>;
  onSuggestIdea: () => Promise<void>;
  onLoadToyPreset: () => void;
  isGenerating: boolean;
  isWritingScript: boolean;
  loadingStates: {
    title: boolean;
    context: boolean;
    idea: boolean;
  };
}

export const SetupForm: React.FC<SetupFormProps> = ({
  settings,
  setSettings,
  bible,
  setBible,
  onGenerate,
  onGenerateScript,
  onSuggestTitle,
  onSuggestContext,
  onSuggestIdea,
  onLoadToyPreset,
  isGenerating,
  isWritingScript,
  loadingStates
}) => {
  const [showBuilder, setShowBuilder] = useState(true);
  const [charBuilder, setCharBuilder] = useState({
    nameEn: '', nameVi: '',
    ageEn: '', ageVi: '',
    faceEn: '', faceVi: '',
    bodyEn: '', bodyVi: '',
    outfitEn: '', outfitVi: '',
    personalityEn: '', personalityVi: ''
  });

  const handleChange = (field: keyof ProjectSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleBibleChange = (field: keyof CharacterBible, value: string) => {
    setBible(prev => ({ ...prev, [field]: value }));
  };

  const handleBuilderChange = (field: keyof typeof charBuilder, value: string) => {
    setCharBuilder(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCharacter = () => {
    // Helper to construct sentence if value exists
    const append = (val: string, prefix: string = '', suffix: string = '') => val ? prefix + val + suffix : '';

    // Construct English Paragraph
    // Format: Name (Age). Body. Face. Outfit. Personality.
    let enParts = [];
    if (charBuilder.nameEn) {
        let namePart = charBuilder.nameEn;
        if (charBuilder.ageEn) namePart += `, ${charBuilder.ageEn}`;
        enParts.push(namePart);
    }
    if (charBuilder.bodyEn) enParts.push(charBuilder.bodyEn);
    if (charBuilder.faceEn) enParts.push(charBuilder.faceEn); // Crucial for consistency
    if (charBuilder.outfitEn) enParts.push(`Wearing ${charBuilder.outfitEn}`);
    if (charBuilder.personalityEn) enParts.push(charBuilder.personalityEn);
    
    const enParagraph = enParts.join('. ') + (enParts.length > 0 ? '.' : '');

    // Construct Vietnamese Paragraph
    let viParts = [];
    if (charBuilder.nameVi) {
        let namePart = charBuilder.nameVi;
        if (charBuilder.ageVi) namePart += `, ${charBuilder.ageVi}`;
        viParts.push(namePart);
    }
    if (charBuilder.bodyVi) viParts.push(charBuilder.bodyVi);
    if (charBuilder.faceVi) viParts.push(charBuilder.faceVi);
    if (charBuilder.outfitVi) viParts.push(`Mặc ${charBuilder.outfitVi}`);
    if (charBuilder.personalityVi) viParts.push(charBuilder.personalityVi);

    const viParagraph = viParts.join('. ') + (viParts.length > 0 ? '.' : '');

    // Append to Bible
    if (enParagraph) {
        setBible(prev => ({
            ...prev,
            english: (prev.english ? prev.english + '\n\n' : '') + enParagraph,
            vietnamese: (prev.vietnamese ? prev.vietnamese + '\n\n' : '') + viParagraph
        }));
    }

    // Reset Builder
    setCharBuilder({
        nameEn: '', nameVi: '',
        ageEn: '', ageVi: '',
        faceEn: '', faceVi: '',
        bodyEn: '', bodyVi: '',
        outfitEn: '', outfitVi: '',
        personalityEn: '', personalityVi: ''
    });
  };

  return (
    <div className="bg-cinema-800 p-6 rounded-xl border border-cinema-700 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-cinema-500">
            <Settings className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">1. Settings / Thiết lập</h2>
        </div>
        <button 
            onClick={onLoadToyPreset}
            className="text-[10px] flex items-center gap-1 bg-cinema-700 hover:bg-cinema-600 text-white px-2 py-1 rounded transition"
            title="Load the Toy Boots/KitKat example"
        >
            <PackageOpen className="w-3 h-3" />
            Load Sample: Toy Story
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Story & Settings */}
        <div className="space-y-6">
          
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
               <label className="block text-sm font-medium text-slate-400">Project Title / Tiêu đề</label>
               <button 
                  onClick={onSuggestTitle} 
                  disabled={loadingStates.title}
                  className="text-[10px] flex items-center gap-1 text-cinema-400 hover:text-cinema-300 disabled:opacity-50"
               >
                 <Wand2 className={`w-3 h-3 ${loadingStates.title ? 'animate-spin' : ''}`} />
                 Suggest Title
               </button>
            </div>
            <input
              type="text"
              value={settings.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none placeholder-slate-600 font-bold text-white"
              placeholder="E.g. The Silent Depth"
            />
          </div>

          {/* Context */}
          <div>
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-400">Context / Bối cảnh</label>
                <button 
                  onClick={onSuggestContext} 
                  disabled={loadingStates.context}
                  className="text-[10px] flex items-center gap-1 text-cinema-400 hover:text-cinema-300 disabled:opacity-50"
               >
                 <Lightbulb className={`w-3 h-3 ${loadingStates.context ? 'animate-spin' : ''}`} />
                 Suggest Context
               </button>
            </div>
            <textarea
              value={settings.context}
              onChange={(e) => handleChange('context', e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-sm focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-20 placeholder-slate-600"
              placeholder="E.g., Deep ocean, steampunk submarine..."
            />
          </div>

          {/* Video Idea & Auto-Write */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-400">Video Idea / Ý tưởng</label>
                <button 
                  onClick={onSuggestIdea} 
                  disabled={loadingStates.idea}
                  className="text-[10px] flex items-center gap-1 text-cinema-400 hover:text-cinema-300 disabled:opacity-50"
               >
                 <Wand2 className={`w-3 h-3 ${loadingStates.idea ? 'animate-spin' : ''}`} />
                 Suggest Idea
               </button>
            </div>
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
                     <span>AI is Writing Story (Strict Consistency)...</span>
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
              placeholder="Generated story will appear here. AI will strictly ensure character consistency..."
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
                max={50}
                value={settings.sceneCount}
                onChange={(e) => handleChange('sceneCount', parseInt(e.target.value))}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-cinema-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Character Bible */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-300 border-b border-cinema-700 pb-2 justify-between">
             <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Character Bible / Hồ sơ nhân vật</span>
             </div>
             <button onClick={() => setShowBuilder(!showBuilder)} className="text-xs text-cinema-500 hover:text-cinema-400 flex items-center">
                 {showBuilder ? <ChevronUp className="w-3 h-3 mr-1"/> : <ChevronDown className="w-3 h-3 mr-1"/>}
                 {showBuilder ? 'Hide Builder' : 'Open Builder'}
             </button>
          </div>

          {/* Character Builder Form */}
          {showBuilder && (
            <div className="bg-cinema-900/50 p-4 rounded-lg border border-cinema-700 space-y-3">
                <div className="flex items-center justify-between text-xs text-cinema-400 uppercase font-bold tracking-wider mb-2">
                    <span className="flex items-center gap-1"><UserPlus className="w-3 h-3" /> Add New Character</span>
                </div>
                
                {/* Name & Age */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] text-slate-500 block">Name / Tên</label>
                        <input value={charBuilder.nameEn} onChange={e => handleBuilderChange('nameEn', e.target.value)} placeholder="English Name" className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-cinema-500 border"/>
                        <input value={charBuilder.nameVi} onChange={e => handleBuilderChange('nameVi', e.target.value)} placeholder="Tên Tiếng Việt" className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs outline-none focus:border-cinema-500 border"/>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 block">Age / Tuổi</label>
                        <input value={charBuilder.ageEn} onChange={e => handleBuilderChange('ageEn', e.target.value)} placeholder="e.g. late 40s" className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-cinema-500 border"/>
                        <input value={charBuilder.ageVi} onChange={e => handleBuilderChange('ageVi', e.target.value)} placeholder="Vd: 40 tuổi" className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs outline-none focus:border-cinema-500 border"/>
                    </div>
                </div>

                {/* Face & Hair - CRITICAL */}
                <div>
                    <label className="text-[10px] text-amber-500 block font-bold">Face & Hair (Focus on Consistency!) / Khuôn mặt & Tóc</label>
                    <input value={charBuilder.faceEn} onChange={e => handleBuilderChange('faceEn', e.target.value)} placeholder="En: High cheekbones, piercing blue eyes, scar on left cheek..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-cinema-500 border"/>
                    <input value={charBuilder.faceVi} onChange={e => handleBuilderChange('faceVi', e.target.value)} placeholder="Vi: Gò má cao, mắt xanh, sẹo trên má trái..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs outline-none focus:border-cinema-500 border"/>
                </div>

                 {/* Body */}
                 <div>
                    <label className="text-[10px] text-slate-500 block">Height & Build / Ngoại hình</label>
                    <input value={charBuilder.bodyEn} onChange={e => handleBuilderChange('bodyEn', e.target.value)} placeholder="En: Tall, muscular build, broad shoulders..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-cinema-500 border"/>
                    <input value={charBuilder.bodyVi} onChange={e => handleBuilderChange('bodyVi', e.target.value)} placeholder="Vi: Cao, dáng vạm vỡ, vai rộng..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs outline-none focus:border-cinema-500 border"/>
                </div>

                 {/* Outfit */}
                 <div>
                    <label className="text-[10px] text-slate-500 block">Outfit / Trang phục</label>
                    <input value={charBuilder.outfitEn} onChange={e => handleBuilderChange('outfitEn', e.target.value)} placeholder="En: Blue naval uniform with gold buttons..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-cinema-500 border"/>
                    <input value={charBuilder.outfitVi} onChange={e => handleBuilderChange('outfitVi', e.target.value)} placeholder="Vi: Quân phục hải quân xanh, khuy vàng..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs outline-none focus:border-cinema-500 border"/>
                </div>

                 {/* Personality */}
                 <div>
                    <label className="text-[10px] text-slate-500 block">Personality / Tính cách</label>
                    <input value={charBuilder.personalityEn} onChange={e => handleBuilderChange('personalityEn', e.target.value)} placeholder="En: Stern, commanding, mysterious..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-cinema-500 border"/>
                    <input value={charBuilder.personalityVi} onChange={e => handleBuilderChange('personalityVi', e.target.value)} placeholder="Vi: Nghiêm nghị, quyền uy, bí ẩn..." className="w-full bg-cinema-800 border-cinema-700 rounded px-2 py-1 text-xs outline-none focus:border-cinema-500 border"/>
                </div>

                <div className="pt-2">
                    <button 
                        onClick={handleAddCharacter}
                        disabled={!charBuilder.nameEn}
                        className="w-full bg-cinema-700 hover:bg-cinema-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <UserPlus className="w-3 h-3" />
                        Add Character to Bible / Thêm vào hồ sơ
                    </button>
                </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase">English Bible (Final Text)</label>
                    <button onClick={() => setBible(prev => ({...prev, english: ''}))} className="text-[10px] text-slate-600 hover:text-red-400 flex items-center gap-1"><Eraser className="w-3 h-3"/> Clear</button>
                </div>
                <textarea
                value={bible.english}
                onChange={(e) => handleBibleChange('english', e.target.value)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs md:text-sm font-mono focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-40 resize-y"
                placeholder="Full character text used for prompts..."
                />
            </div>

            <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase">Vietnamese Bible (Final Text)</label>
                    <button onClick={() => setBible(prev => ({...prev, vietnamese: ''}))} className="text-[10px] text-slate-600 hover:text-red-400 flex items-center gap-1"><Eraser className="w-3 h-3"/> Clear</button>
                </div>
                <textarea
                value={bible.vietnamese}
                onChange={(e) => handleBibleChange('vietnamese', e.target.value)}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs md:text-sm font-mono focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500 outline-none h-32 resize-y"
                placeholder="Nội dung nhân vật tiếng Việt..."
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
