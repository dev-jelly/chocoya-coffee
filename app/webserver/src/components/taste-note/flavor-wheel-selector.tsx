'use client';

import { useState, useEffect } from 'react';
import { flavorLabels, flavorWheel, FlavorLabel } from '@/data/flavor-labels';
import { Check, X, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface FlavorWheelSelectorProps {
  selectedLabels: string[];
  onChange: (labels: string[]) => void;
}

// 카테고리 타입 정의
interface FlavorCategory {
  name: {
    en: string;
    ko: string;
  };
  colorCode: string;
  subcategories: any[];
}

export function FlavorWheelSelector({ selectedLabels, onChange }: FlavorWheelSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedLabels || []);
  const [activeTab, setActiveTab] = useState<string>(flavorWheel.categories[0].name.en);
  const [expandedAccordion, setExpandedAccordion] = useState<string>("categories");

  // 카테고리 ID 매핑을 생성
  const categoryIdMap = new Map<string, string>();

  // 각 카테고리에 대한 ID를 생성하고 매핑
  flavorWheel.categories.forEach(category => {
    const categoryId = `category-${category.name.en.toLowerCase().replace(/\s+/g, '-')}`;
    categoryIdMap.set(category.name.en, categoryId);
  });

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

  // 대분류 라벨 정보 가져오기
  const getCategoryInfo = (category: FlavorCategory) => {
    const id = categoryIdMap.get(category.name.en);
    return {
      id,
      name: category.name.ko,
      englishName: category.name.en,
      color: category.colorCode
    };
  };

  // 선택된 라벨 표시를 위한 라벨 정보 가져오기
  const getLabelInfo = (id: string) => {
    // 먼저 flavorLabels에서 검색
    const flavorLabel = flavorLabels.find(label => label.id === id);
    if (flavorLabel) return flavorLabel;

    // 카테고리 ID인 경우
    for (const category of flavorWheel.categories) {
      const categoryId = categoryIdMap.get(category.name.en);
      if (categoryId === id) {
        return {
          id,
          name: category.name.ko,
          color: category.colorCode
        };
      }
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* 선택된 향미 표시 영역 */}
      <div className="border rounded-lg p-4 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">선택된 향미 노트</h3>
          {selected.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
            >
              모두 지우기
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 min-h-10">
          {selected.length > 0 ? (
            selected.map(id => {
              const label = getLabelInfo(id);
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
                    className="ml-1 rounded-full hover:bg-muted/50 p-0.5 cursor-pointer"
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

      {/* 도움말 추가 */}
      <div className="text-sm bg-accent/30 p-3 rounded-md text-muted-foreground">
        <p><span className="font-medium">대분류</span>(과일, 꽃 등), <span className="font-medium">중분류</span>(베리류, 장미 등), <span className="font-medium">세부 향미</span>(블루베리, 다마스크 로즈 등)를 모두 선택할 수 있습니다.</p>
      </div>

      {/* 새로운 통합 UI */}
      <div className="border rounded-lg overflow-hidden">
        {/* 카테고리 탭 */}
        <Tabs defaultValue={flavorWheel.categories[0].name.en} className="w-full">
          <div className="bg-muted/30 p-2">
            <ScrollArea className="w-full">
              <TabsList className="w-full h-auto flex flex-wrap bg-transparent gap-1">
                {flavorWheel.categories.map(category => {
                  const categoryInfo = getCategoryInfo(category);
                  const isSelected = categoryInfo.id ? selected.includes(categoryInfo.id) : false;

                  return (
                    <TabsTrigger
                      key={category.name.en}
                      value={category.name.en}
                      className={`py-1 px-2 text-xs whitespace-nowrap rounded-full cursor-pointer 
                        ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      style={{
                        backgroundColor: `${category.colorCode}30`,
                        borderLeft: isSelected ? `2px solid ${category.colorCode}` : 'none'
                      }}
                      onClick={(e) => {
                        // 클릭 시 탭 변경하면서 카테고리도 선택
                        if ((e.ctrlKey || e.metaKey) && categoryInfo.id) {
                          e.preventDefault();
                          handleLabelClick(categoryInfo.id);
                        }
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-1 inline-block"
                        style={{ backgroundColor: category.colorCode }}
                      />
                      {category.name.ko}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </ScrollArea>
          </div>

          {flavorWheel.categories.map(category => {
            const categoryInfo = getCategoryInfo(category);
            const isSelected = categoryInfo.id ? selected.includes(categoryInfo.id) : false;

            return (
              <TabsContent
                key={category.name.en}
                value={category.name.en}
                className="m-0 p-3"
              >
                {/* 대분류 선택 버튼 */}
                <button
                  type="button"
                  className={`w-full p-2 mb-3 rounded-md transition-colors cursor-pointer flex items-center 
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary/20 hover:bg-secondary/40'}`}
                  onClick={() => categoryInfo.id && handleLabelClick(categoryInfo.id)}
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: category.colorCode }}
                  />
                  <span className="font-medium">{category.name.ko}</span>
                  <span className="text-xs ml-1 opacity-70">({category.name.en})</span>
                  {isSelected && <Check size={16} className="ml-auto" />}
                </button>

                {/* 서브카테고리 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.subcategories.map(subcategory => {
                    const subcategoryLabel = flavorLabels.find(
                      label => label.name === subcategory.name.ko || label.englishName === subcategory.name.en
                    );

                    const hasSubItems = subcategory.flavors && subcategory.flavors.length > 0;
                    const subcategoryId = subcategoryLabel?.id || '';
                    const isSubcategorySelected = subcategoryId && selected.includes(subcategoryId);

                    return (
                      <div
                        key={subcategory.name.en}
                        className="border rounded-md overflow-hidden"
                      >
                        {/* 서브카테고리 헤더 - 클릭 가능 */}
                        <div
                          className={`p-2 cursor-pointer flex items-center justify-between
                            ${isSubcategorySelected ? 'bg-primary/10' : 'bg-secondary/10'}`}
                          style={{
                            borderLeft: `3px solid ${subcategory.colorCode}`
                          }}
                          onClick={() => {
                            if (subcategoryLabel) {
                              handleLabelClick(subcategoryLabel.id);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: subcategory.colorCode }}
                            />
                            <span className="font-medium text-sm">{subcategory.name.ko}</span>
                            <span className="text-xs text-muted-foreground ml-1">({subcategory.name.en})</span>
                          </div>
                          {isSubcategorySelected && <Check size={14} />}
                        </div>

                        {/* 세부 향미들 */}
                        {hasSubItems && (
                          <div className="p-2 border-t bg-background/50">
                            <div className="flex flex-wrap gap-1">
                              {subcategory.flavors?.map(flavor => {
                                const flavorLabel = flavorLabels.find(
                                  label => label.name === flavor.ko || label.englishName === flavor.en
                                );

                                if (!flavorLabel) return null;
                                const isFlavorSelected = selected.includes(flavorLabel.id);

                                return (
                                  <button
                                    key={flavor.en}
                                    type="button"
                                    className={`text-xs px-2 py-1 rounded-full transition-colors cursor-pointer
                                      ${isFlavorSelected ? 'bg-primary text-primary-foreground' :
                                        'bg-muted/50 hover:bg-muted border border-border'}`}
                                    style={!isFlavorSelected ? { borderLeft: `2px solid ${flavor.colorCode}` } : {}}
                                    onClick={() => handleLabelClick(flavorLabel.id)}
                                  >
                                    {isFlavorSelected && <Check size={8} className="inline mr-1" />}
                                    {flavor.ko}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
} 