import React, { useState } from 'react';
import { FullProjectData } from '../types';
import { X, Download, Upload, Copy, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullProjectData;
  onImport: (data: FullProjectData) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data, onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Basic validation
      if (!parsed.settings || !parsed.characterBible || !parsed.scenes) {
        throw new Error("Invalid JSON structure");
      }
      onImport(parsed);
      onClose();
      setJsonInput('');
      setError(null);
    } catch (e) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cinema-800 border border-cinema-700 rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cinema-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Import / Export Project</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Export Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-cinema-400 uppercase flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Current Project
            </h4>
            <div className="relative">
                <pre className="bg-cinema-900 border border-cinema-700 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto h-32">
                {currentJson}
                </pre>
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-cinema-700 hover:bg-cinema-600 text-white px-3 py-1.5 rounded text-xs flex items-center gap-2"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy JSON'}
                </button>
            </div>
          </div>

          <hr className="border-cinema-700" />

          {/* Import Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-cinema-400 uppercase flex items-center gap-2">
                <Upload className="w-4 h-4" /> Import Project
            </h4>
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here..."
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg p-3 text-xs font-mono text-slate-200 outline-none focus:border-cinema-500 h-32"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button 
                onClick={handleImport}
                disabled={!jsonInput}
                className="w-full bg-cinema-500 hover:bg-cinema-400 text-cinema-900 font-bold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Load Project Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};