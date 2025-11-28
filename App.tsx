
import React, { useState } from 'react';
import { SetupForm } from './components/SetupForm';
import { SceneCard } from './components/SceneCard';
import { ExportModal } from './components/ExportModal';
import { generateStoryboard, regenerateScene, generateScript, suggestTitle, suggestContext, suggestIdea } from './services/geminiService';
import { DEFAULT_BIBLE, DEFAULT_SETTINGS, TOY_PROJECT_DATA } from './constants';
import { ProjectSettings, CharacterBible, SceneData, FullProjectData } from './types';
import { Film, Download, Trash2, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ProjectSettings>(DEFAULT_SETTINGS);
  const [bible, setBible] = useState<CharacterBible>(DEFAULT_BIBLE);
  const [scenes, setScenes] = useState<SceneData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWritingScript, setIsWritingScript] = useState(false);
  
  // Loading states for suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState({
    title: false,
    context: false,
    idea: false
  });

  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  const [showExport, setShowExport] = useState(false);

  const handleSuggestTitle = async () => {
    setLoadingSuggestions(prev => ({ ...prev, title: true }));
    try {
        const title = await suggestTitle(settings);
        setSettings(prev => ({ ...prev, title }));
    } catch(e) { console.error(e); } 
    finally { setLoadingSuggestions(prev => ({ ...prev, title: false })); }
  };

  const handleSuggestContext = async () => {
    setLoadingSuggestions(prev => ({ ...prev, context: true }));
    try {
        const context = await suggestContext(settings.style);
        setSettings(prev => ({ ...prev, context }));
    } catch(e) { console.error(e); } 
    finally { setLoadingSuggestions(prev => ({ ...prev, context: false })); }
  };

  const handleSuggestIdea = async () => {
    setLoadingSuggestions(prev => ({ ...prev, idea: true }));
    try {
        const videoIdea = await suggestIdea(settings);
        setSettings(prev => ({ ...prev, videoIdea }));
    } catch(e) { console.error(e); } 
    finally { setLoadingSuggestions(prev => ({ ...prev, idea: false })); }
  };

  const handleGenerateScript = async () => {
    setIsWritingScript(true);
    try {
        const script = await generateScript(settings, bible);
        setSettings(prev => ({ ...prev, script }));
    } catch (error) {
        alert("Failed to write script. Please check API key and try again.");
    } finally {
        setIsWritingScript(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedScenes = await generateStoryboard(settings, bible);
      setScenes(generatedScenes);
    } catch (error) {
      alert("Failed to generate scenes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateScene = async (id: string, sceneNumber: number) => {
    const sceneToRegen = scenes.find(s => s.id === id);
    if (!sceneToRegen) return;

    setRegeneratingIds(prev => new Set(prev).add(id));
    try {
      const newScene = await regenerateScene(id, sceneNumber, settings, bible, sceneToRegen);
      setScenes(prev => prev.map(s => s.id === id ? newScene : s));
    } catch (error) {
      console.error(error);
      alert("Failed to regenerate scene");
    } finally {
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleUpdateScene = (id: string, updated: Partial<SceneData>) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const handleDeleteScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
  };
  
  const handleAddScene = () => {
    const newId = crypto.randomUUID();
    const lastNumber = scenes.length > 0 ? scenes[scenes.length - 1].number : 0;
    const newScene: SceneData = {
        id: newId,
        number: lastNumber + 1,
        descriptionEn: "New empty scene...",
        descriptionVi: "Cảnh mới...",
        action: "Enter action...",
        camera: "Wide shot",
        lighting: "Natural light",
        transition: "Cut to"
    };
    setScenes(prev => [...prev, newScene]);
  };

  const handleClearAll = () => {
    if(confirm("Are you sure you want to delete all scenes?")) {
        setScenes([]);
    }
  };

  const handleLoadToyPreset = () => {
      if(confirm("Load the 'Toy Story' preset? This will overwrite current settings.")) {
          setSettings(TOY_PROJECT_DATA.settings);
          setBible(TOY_PROJECT_DATA.characterBible);
          setScenes(TOY_PROJECT_DATA.scenes);
      }
  };

  const handleImport = (data: FullProjectData) => {
    setSettings(data.settings);
    setBible(data.characterBible);
    setScenes(data.scenes);
  };

  const fullData: FullProjectData = {
    settings,
    characterBible: bible,
    scenes
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-cinema-900/90 backdrop-blur-md border-b border-cinema-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-cinema-500" />
              <span className="text-xl font-bold tracking-tight text-white">VEO 3 <span className="text-cinema-500">Architect</span></span>
            </div>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white bg-cinema-800 hover:bg-cinema-700 px-3 py-1.5 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>Import / Export</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step 1 & 2: Setup */}
        <section>
          <SetupForm 
            settings={settings} 
            setSettings={setSettings} 
            bible={bible} 
            setBible={setBible}
            onGenerate={handleGenerate}
            onGenerateScript={handleGenerateScript}
            onSuggestTitle={handleSuggestTitle}
            onSuggestContext={handleSuggestContext}
            onSuggestIdea={handleSuggestIdea}
            onLoadToyPreset={handleLoadToyPreset}
            loadingStates={loadingSuggestions}
            isGenerating={isGenerating}
            isWritingScript={isWritingScript}
          />
        </section>

        {/* Step 3: Storyboard */}
        {scenes.length > 0 && (
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-cinema-500" />
                    Storyboard ({scenes.length} Scenes)
                </h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={handleAddScene}
                        className="flex items-center space-x-1 text-xs font-bold text-cinema-900 bg-cinema-500 hover:bg-cinema-400 px-3 py-1.5 rounded transition"
                    >
                        <Plus className="w-4 h-4" /> <span>Add Scene</span>
                    </button>
                    <button 
                        onClick={handleClearAll}
                        className="flex items-center space-x-1 text-xs font-bold text-red-300 hover:text-red-100 bg-red-900/50 hover:bg-red-900 px-3 py-1.5 rounded transition"
                    >
                        <Trash2 className="w-4 h-4" /> <span>Clear All</span>
                    </button>
                </div>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenes.map((scene) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  bible={bible}
                  ratio={settings.ratio}
                  onUpdate={handleUpdateScene}
                  onDelete={handleDeleteScene}
                  onRegenerate={handleRegenerateScene}
                  isRegenerating={regeneratingIds.has(scene.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <ExportModal 
        isOpen={showExport} 
        onClose={() => setShowExport(false)} 
        data={fullData}
        onImport={handleImport}
      />
    </div>
  );
};

export default App;
