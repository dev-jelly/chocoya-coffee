'use client';

import { useState, useEffect } from 'react';
import { flavorLabels } from '@/data/flavor-labels';
import { Check, X } from 'lucide-react';

// 카테고리별로 레이블을 그룹화
const groupedLabels = flavorLabels.reduce((acc, label) => {
  if (!acc[label.category]) {
    acc[label.category] = [];
  }
  acc[label.category].push(label);
  return acc;
}, {} as Record<string, typeof flavorLabels>);

const categoryNames: Record<string, string> = {
  fruit: '과일',
  floral: '꽃',
  sweet: '달콤함',
  nutty: '견과류',
  spice: '향신료',
  roasted: '로스팅',
  other: '기타'
};

interface FlavorWheelSelectorProps {
  selectedLabels: string[];
  onChange: (labels: string[]) => void;
}

export function FlavorWheelSelector({ selectedLabels, onChange }: FlavorWheelSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedLabels || []);
  
  useEffect(() => {
    setSelected(selectedLabels || []);
  }, [selectedLabels]);
  
  const handleLabelClick = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(labelId => labelId !== id)
      : [...selected, id];
    
    setSelected(newSelected);
    onChange(newSelected);
  };
  
  const getSelectedColors = () => {
    return selected.map(id => {
      const label = flavorLabels.find(label => label.id === id);
      return label ? label.color : null;
    }).filter(Boolean) as string[];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {selected.length > 0 ? (
          selected.map(id => {
            const label = flavorLabels.find(label => label.id === id);
            if (!label) return null;
            
            return (
              <div 
                key={id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${label.color}30`, 
                  color: label.color,
                  border: `1px solid ${label.color}`
                }}
              >
                <span className="mr-1">{label.name}</span>
                <button 
                  type="button"
                  onClick={() => handleLabelClick(id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-muted-foreground text-sm">선택된 맛 노트가 없습니다.</div>
        )}
      </div>
      
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex items-center justify-center mb-4">
          {getSelectedColors().length > 0 ? (
            <div className="flex items-center">
              {getSelectedColors().slice(0, 5).map((color, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0"
                  style={{ backgroundColor: color, zIndex: 10 - i }}
                />
              ))}
              {getSelectedColors().length > 5 && (
                <div className="ml-2 text-sm text-muted-foreground">
                  +{getSelectedColors().length - 5}
                </div>
              )}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              ?
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {Object.entries(groupedLabels).map(([category, labels]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2">{categoryNames[category] || category}</h4>
              <div className="flex flex-wrap gap-2">
                {labels.map(label => (
                  <button
                    key={label.id}
                    type="button"
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs transition-colors ${
                      selected.includes(label.id) 
                        ? 'text-white' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                    style={{ 
                      backgroundColor: selected.includes(label.id) ? label.color : 'transparent',
                      border: `1px solid ${selected.includes(label.id) ? label.color : 'currentColor'}`
                    }}
                    onClick={() => handleLabelClick(label.id)}
                  >
                    {selected.includes(label.id) && <Check size={12} className="mr-1" />}
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 