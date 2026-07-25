import React, { useState } from 'react';

const INITIAL_THEMES = [
  { id: 'isolation', label: 'Isolation', value: 40 },
  { id: 'revenge', label: 'Revenge', value: 30 },
  { id: 'betrayal', label: 'Betrayal', value: 20 },
  { id: 'nostalgia', label: 'Nostalgia', value: 10 },
];

import { GripVertical } from 'lucide-react';

export default function ThemeBarChart() {
  const [themes, setThemes] = useState(INITIAL_THEMES);

  const handleSliderChange = (index, e) => {
    const newVal = parseFloat(e.target.value);
    const newThemes = [...themes];
    
    const oldVal = newThemes[index].value;
    const diff = newVal - oldVal;
    
    newThemes[index] = { ...newThemes[index], value: newVal };

    const otherIndices = newThemes.map((_, i) => i).filter(i => i !== index);
    const sumOthers = 100 - oldVal;

    otherIndices.forEach(i => {
      let updatedVal = newThemes[i].value;
      if (sumOthers <= 0) {
        updatedVal -= diff / otherIndices.length;
      } else {
        updatedVal -= diff * (themes[i].value / sumOthers);
      }
      newThemes[i] = { ...newThemes[i], value: Math.max(0, updatedVal) };
    });

    // Normalize everything to ensure exact 100% total
    const newSumOthers = otherIndices.reduce((acc, i) => acc + newThemes[i].value, 0);
    const targetSumOthers = 100 - newVal;
    
    if (newSumOthers > 0) {
      otherIndices.forEach(i => {
        newThemes[i].value = (newThemes[i].value / newSumOthers) * targetSumOthers;
      });
    } else if (targetSumOthers > 0) {
      otherIndices.forEach(i => {
        newThemes[i].value = targetSumOthers / otherIndices.length;
      });
    }

    setThemes(newThemes);
  };

  return (
    <div className="flex w-full flex-col justify-center h-full gap-5 py-4 px-2 lg:mt-4 border-l border-neutral-800 pl-4">
      {themes.map((theme, idx) => (
        <div key={theme.id} className="flex items-center gap-4 group relative">
          
          {/* Y-axis Label */}
          <div className="w-24 text-right shrink-0">
            <span className="font-semibold text-white tracking-wide text-[15px]">{theme.label}</span>
          </div>

          {/* X-axis Bar (Slider) */}
          <div className="relative h-[36px] flex-1 flex items-center">
            {/* Background track */}
            <div className="absolute inset-0 rounded-sm bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-inner">
               {/* Fill */}
               <div 
                 className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-[#E61C38] transition-all duration-[50ms] ease-out rounded-sm flex items-center justify-end pr-2"
                 style={{ width: `${theme.value}%`, boxShadow: '0 0 15px rgba(230,28,56,0.5)' }}
               >
                 {/* Grab Icon */}
                 <GripVertical className="w-4 h-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
            
            {/* Invisible native range slider on top for interaction */}
            <input 
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={theme.value}
              onChange={(e) => handleSliderChange(idx, e)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
            />
          </div>

          {/* Percentage */}
          <div className="w-12 text-left shrink-0">
            <span className="text-white font-mono text-[15px]">{Math.round(theme.value)}%</span>
          </div>

        </div>
      ))}
    </div>
  );
}
