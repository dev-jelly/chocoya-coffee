'use client';

import { useState, useEffect } from 'react';
import { flavorLabels, flavorWheel, FlavorLabel } from '@/data/flavor-labels';
import { Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FlavorWheelSelectorProps {
  selectedLabels: string[];
  onChange: (labels: string[]) => void;
}

export function FlavorWheelSelector({ selectedLabels, onChange }: FlavorWheelSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedLabels || []);
  const [activeTab, setActiveTab] = useState<string>(flavorWheel.categories[0].name.en);

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

  // 선택된 향미 목록 삭제
  const handleRemoveSelected = (id: string) => {
    const newSelected = selected.filter(labelId => labelId !== id);
    setSelected(newSelected);
    onChange(newSelected);
  };

  // 모든 선택 초기화
  const handleClearAll = () => {
    setSelected([]);
    onChange([]);
  };

  return (
    <div className="space-y-6">
      {/* 선택된 향미 표시 영역 */}
      <div className="border rounded-lg p-4 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">선택된 향미 노트</h3>
          {selected.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              모두 지우기
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 min-h-10">
          {selected.length > 0 ? (
            selected.map(id => {
              const label = flavorLabels.find(label => label.id === id);
              if (!label) return null;

              return (
                <Badge
                  key={id}
                  variant="outline"
                  className="flex items-center gap-1 py-1 pl-3"
                  style={{
                    borderColor: label.color,
                    backgroundColor: `${label.color}10`
                  }}
                >
                  <span>{label.name}</span>
                  <button
                    onClick={() => handleRemoveSelected(id)}
                    className="ml-1 rounded-full hover:bg-muted/50 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground p-2">선택된 향미 노트가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 향미 선택 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="w-full mb-4 h-auto flex flex-wrap p-1">
            {flavorWheel.categories.map(category => (
              <TabsTrigger
                key={category.name.en}
                value={category.name.en}
                className="py-1 px-3 whitespace-nowrap"
                style={{
                  borderBottom: activeTab === category.name.en
                    ? `2px solid ${category.colorCode}`
                    : 'none'
                }}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2 inline-block"
                  style={{ backgroundColor: category.colorCode }}
                />
                {category.name.ko}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {flavorWheel.categories.map(category => (
          <TabsContent
            key={category.name.en}
            value={category.name.en}
            className="mt-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.subcategories.map(subcategory => (
                <div key={subcategory.name.en} className="border rounded-md p-3">
                  <h4 className="font-medium mb-2 text-sm flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: subcategory.colorCode }}
                    />
                    {subcategory.name.ko}
                    <span className="text-xs text-muted-foreground ml-1">({subcategory.name.en})</span>
                  </h4>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {/* 서브카테고리 자체도 선택할 수 있게 */}
                    {(() => {
                      const subcategoryLabel = flavorLabels.find(
                        label => label.name === subcategory.name.ko || label.englishName === subcategory.name.en
                      );

                      if (subcategoryLabel) {
                        const isSelected = selected.includes(subcategoryLabel.id);
                        return (
                          <button
                            type="button"
                            className={`text-xs px-2 py-1 rounded-full transition-colors ${isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                              }`}
                            onClick={() => handleLabelClick(subcategoryLabel.id)}
                          >
                            {isSelected && <Check size={10} className="inline mr-1" />}
                            {subcategoryLabel.name}
                          </button>
                        );
                      }
                      return null;
                    })()}

                    {/* 세부 향미들 */}
                    {subcategory.flavors?.map(flavor => {
                      const flavorLabel = flavorLabels.find(
                        label => label.name === flavor.ko || label.englishName === flavor.en
                      );

                      if (!flavorLabel) return null;

                      const isSelected = selected.includes(flavorLabel.id);

                      return (
                        <button
                          key={flavor.en}
                          type="button"
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                            }`}
                          onClick={() => handleLabelClick(flavorLabel.id)}
                        >
                          {isSelected && <Check size={10} className="inline mr-1" />}
                          {flavor.ko}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 