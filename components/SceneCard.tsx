import React, { useState } from 'react';
import { SceneData, CharacterBible, AspectRatio } from '../types';
import { Copy, RefreshCw, Trash2, Edit3, Save, Video, Globe } from 'lucide-react';

interface SceneCardProps {
  scene: SceneData;
  bible: CharacterBible;
  ratio: AspectRatio;
  onUpdate: (id: string, updatedScene: Partial<SceneData>) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string, sceneNumber: number) => void;
  isRegenerating: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  bible,
  ratio,
  onUpdate,
  onDelete,
  onRegenerate,
  isRegenerating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localScene, setLocalScene] = useState<SceneData>(scene);
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en');

  // Sync props to state if not editing
  React.useEffect(() => {
    if (!isEditing) {
      setLocalScene(scene);
    }
  }, [scene, isEditing]);

  const handleSave = () => {
    onUpdate(scene.id, localScene);
    setIsEditing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  // Construct the full prompt dynamically
  const bibleText = activeTab === 'en' ? bible.english : bible.vietnamese;
  const descriptionText = activeTab === 'en' ? localScene.descriptionEn : localScene.descriptionVi;
  
  // Format:
  // [Character Bible]
  //
  // [Visual Description]
  // Camera: ...
  // Lighting: ...
  // Transition: ...
  // Ratio: ...
  const fullPrompt = `${bibleText.trim()}

${descriptionText.trim()}
${localScene.dialogue ? `Dialogue: "${localScene.dialogue}"` : ''}
Camera: ${localScene.camera}
Lighting: ${localScene.lighting}
Transition: ${localScene.transition || 'Cut To'}
Ratio: ${ratio}`;

  return (
    <div className="bg-cinema-800 border border-cinema-700 rounded-xl overflow-hidden shadow-md flex flex-col">
      {/* Header Bar */}
      <div className="bg-cinema-900/50 p-3 flex justify-between items-center border-b border-cinema-700">
        <div className="flex items-center space-x-2">
            <span className="bg-cinema-500 text-cinema-900 text-xs font-bold px-2 py-1 rounded">SCENE {scene.number}</span>
            <div className="flex space-x-1 bg-cinema-900 rounded p-1">
                <button 
                    onClick={() => setActiveTab('en')}
                    className={`px-2 py-0.5 text-xs rounded transition ${activeTab === 'en' ? 'bg-cinema-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    EN
                </button>
                <button 
                    onClick={() => setActiveTab('vi')}
                    className={`px-2 py-0.5 text-xs rounded transition ${activeTab === 'vi' ? 'bg-cinema-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    VN
                </button>
            </div>
        </div>
        
        <div className="flex space-x-1">
           {isEditing ? (
             <button onClick={handleSave} className="p-1.5 text-green-400 hover:bg-cinema-700 rounded transition" title="Save">
               <Save className="w-4 h-4" />
             </button>
           ) : (
             <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-400 hover:text-white hover:bg-cinema-700 rounded transition" title="Edit">
               <Edit3 className="w-4 h-4" />
             </button>
           )}
           
           <button 
             onClick={() => onRegenerate(scene.id, scene.number)} 
             disabled={isRegenerating}
             className={`p-1.5 text-blue-400 hover:bg-cinema-700 rounded transition ${isRegenerating ? 'animate-spin' : ''}`}
             title="Regenerate"
           >
             <RefreshCw className="w-4 h-4" />
           </button>
           
           <button onClick={() => onDelete(scene.id)} className="p-1.5 text-red-400 hover:bg-cinema-700 rounded transition" title="Delete">
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4 flex-1">
        
        {/* Visual Description */}
        <div>
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center">
                <Video className="w-3 h-3 mr-1" /> Visual / Mô tả hình ảnh
            </label>
            {isEditing ? (
                <textarea 
                    value={activeTab === 'en' ? localScene.descriptionEn : localScene.descriptionVi}
                    onChange={(e) => {
                        if (activeTab === 'en') setLocalScene({...localScene, descriptionEn: e.target.value});
                        else setLocalScene({...localScene, descriptionVi: e.target.value});
                    }}
                    className="w-full bg-cinema-900 border border-cinema-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-cinema-500 h-28"
                />
            ) : (
                <p className="text-sm text-slate-300 leading-relaxed">
                    {activeTab === 'en' ? localScene.descriptionEn : localScene.descriptionVi}
                </p>
            )}
        </div>

        {/* Technical Details Grid */}
        <div className="grid grid-cols-3 gap-3">
             <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Camera</label>
                 {isEditing ? (
                    <input 
                        value={localScene.camera}
                        onChange={(e) => setLocalScene({...localScene, camera: e.target.value})}
                        className="w-full bg-cinema-900 border border-cinema-700 rounded px-2 py-1 text-xs text-slate-300"
                    />
                 ) : (
                    <p className="text-xs text-cinema-400">{localScene.camera}</p>
                 )}
             </div>
             <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Lighting</label>
                {isEditing ? (
                    <input 
                        value={localScene.lighting}
                        onChange={(e) => setLocalScene({...localScene, lighting: e.target.value})}
                        className="w-full bg-cinema-900 border border-cinema-700 rounded px-2 py-1 text-xs text-slate-300"
                    />
                 ) : (
                    <p className="text-xs text-cinema-400">{localScene.lighting}</p>
                 )}
             </div>
             <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Transition</label>
                {isEditing ? (
                    <input 
                        value={localScene.transition || ''}
                        placeholder="Cut to"
                        onChange={(e) => setLocalScene({...localScene, transition: e.target.value})}
                        className="w-full bg-cinema-900 border border-cinema-700 rounded px-2 py-1 text-xs text-slate-300"
                    />
                 ) : (
                    <p className="text-xs text-cinema-400">{localScene.transition || 'Cut To'}</p>
                 )}
             </div>
        </div>
        
        {/* Action/Dialogue */}
        <div>
             <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Action & Dialogue / Hành động & Thoại</label>
             {isEditing ? (
                <div className="space-y-2">
                    <input 
                        value={localScene.action}
                        placeholder="Action..."
                        onChange={(e) => setLocalScene({...localScene, action: e.target.value})}
                        className="w-full bg-cinema-900 border border-cinema-700 rounded px-2 py-1 text-xs text-slate-300"
                    />
                    <input 
                        value={localScene.dialogue || ''}
                        placeholder="Dialogue (Optional)..."
                        onChange={(e) => setLocalScene({...localScene, dialogue: e.target.value})}
                        className="w-full bg-cinema-900 border border-cinema-700 rounded px-2 py-1 text-xs text-slate-300 italic"
                    />
                </div>
             ) : (
                <div className="space-y-1">
                    <p className="text-xs text-slate-300"><span className="text-slate-500">Act:</span> {localScene.action}</p>
                    {localScene.dialogue && <p className="text-xs text-amber-400 italic"><span className="text-slate-500 not-italic">Dial:</span> "{localScene.dialogue}"</p>}
                </div>
             )}
        </div>

        {/* Full Prompt Box (Read-Only Copy Source) */}
        <div className="pt-2 border-t border-cinema-700">
            <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] text-cinema-500 font-bold uppercase">Final VEO 3 Prompt ({activeTab.toUpperCase()})</label>
                <button 
                    onClick={() => copyToClipboard(fullPrompt)}
                    className="flex items-center space-x-1 text-[10px] bg-cinema-700 hover:bg-cinema-600 text-white px-2 py-1 rounded transition"
                >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                </button>
            </div>
            <div className="relative group">
                <textarea 
                    readOnly
                    value={fullPrompt}
                    className="w-full bg-black/40 border border-cinema-700/50 rounded p-2 text-[10px] font-mono text-slate-400 h-24 resize-none outline-none"
                />
            </div>
        </div>

      </div>
    </div>
  );
};
