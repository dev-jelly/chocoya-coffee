'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { getGrinders } from '@/lib/actions/grinder';
import { grinderTypeNames, adjustmentTypeNames } from '@/data/grinders';

interface GrinderSelectorProps {
    value: string;
    onChange: (value: string) => void;
    brewingMethod: string;
    onGrinderSettingChange: (setting: string) => void;
}

interface Grinder {
    id: string;
    name: string;
    name_ko?: string;
    brand: string;
    type: string;
    adjustmentType: string;
    settings: {
        id: string;
        name: string;
        name_ko?: string;
        value: string;
        brewingMethod: string;
        description: string;
        description_ko?: string;
    }[];
}

export function GrinderSelector({
    value,
    onChange,
    brewingMethod,
    onGrinderSettingChange
}: GrinderSelectorProps) {
    const [open, setOpen] = useState(false);
    const [grinders, setGrinders] = useState<Grinder[]>([]);
    const [selectedGrinder, setSelectedGrinder] = useState<Grinder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrinders = async () => {
            setLoading(true);
            try {
                const data = await getGrinders();
                setGrinders(data);

                if (value) {
                    const selected = data.find(g => g.id === value);
                    setSelectedGrinder(selected || null);
                }
            } catch (error) {
                console.error('Error fetching grinders:', error);
            }
            setLoading(false);
        };

        fetchGrinders();
    }, [value]);

    const handleGrinderSelect = (selectedId: string) => {
        onChange(selectedId);
        setOpen(false);

        const selected = grinders.find(g => g.id === selectedId);
        setSelectedGrinder(selected || null);

        // 선택한 그라인더에서 현재 추출 방식에 맞는 설정 찾기
        if (selected && brewingMethod) {
            const matchedSettings = selected.settings.filter(setting =>
                setting.brewingMethod.toLowerCase().includes(brewingMethod.toLowerCase())
            );

            if (matchedSettings.length > 0) {
                // 첫 번째 매칭된 설정값 사용
                onGrinderSettingChange(matchedSettings[0].value);
            }
        }
    };

    const filteredSettings = selectedGrinder?.settings.filter(setting =>
        setting.brewingMethod.toLowerCase().includes(brewingMethod.toLowerCase())
    ) || [];

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={loading}
                    >
                        {loading ? (
                            "로딩 중..."
                        ) : selectedGrinder ? (
                            <div className="flex items-center">
                                <Coffee className="mr-2 h-4 w-4" />
                                <span>{selectedGrinder.brand} {selectedGrinder.name_ko || selectedGrinder.name}</span>
                            </div>
                        ) : (
                            "그라인더 선택..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full" style={{ width: "300px" }}>
                    <Command>
                        <CommandInput placeholder="그라인더 검색..." />
                        <CommandList>
                            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                            <CommandGroup heading="수동 그라인더">
                                {grinders
                                    .filter(grinder => grinder.type === 'manual')
                                    .map(grinder => (
                                        <CommandItem
                                            key={grinder.id}
                                            value={grinder.id}
                                            onSelect={handleGrinderSelect}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === grinder.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{grinder.brand} {grinder.name_ko || grinder.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {adjustmentTypeNames[grinder.adjustmentType as keyof typeof adjustmentTypeNames]} 방식, 설정 {grinder.settings.length}개
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                            <CommandGroup heading="전동 그라인더">
                                {grinders
                                    .filter(grinder => grinder.type === 'electric')
                                    .map(grinder => (
                                        <CommandItem
                                            key={grinder.id}
                                            value={grinder.id}
                                            onSelect={handleGrinderSelect}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === grinder.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{grinder.brand} {grinder.name_ko || grinder.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {adjustmentTypeNames[grinder.adjustmentType as keyof typeof adjustmentTypeNames]} 방식, 설정 {grinder.settings.length}개
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                            <CommandGroup heading="상업용 그라인더">
                                {grinders
                                    .filter(grinder => grinder.type === 'commercial')
                                    .map(grinder => (
                                        <CommandItem
                                            key={grinder.id}
                                            value={grinder.id}
                                            onSelect={handleGrinderSelect}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === grinder.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{grinder.brand} {grinder.name_ko || grinder.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {adjustmentTypeNames[grinder.adjustmentType as keyof typeof adjustmentTypeNames]} 방식, 설정 {grinder.settings.length}개
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* 선택한 그라인더의 추출 방식에 맞는 설정 표시 */}
            {selectedGrinder && filteredSettings.length > 0 && (
                <div className="mt-2">
                    <p className="text-sm font-medium mb-1">추천 분쇄도 설정:</p>
                    <ul className="text-sm space-y-1">
                        {filteredSettings.map(setting => (
                            <li
                                key={setting.id}
                                className="py-1 px-2 rounded bg-secondary/20 cursor-pointer hover:bg-secondary/40"
                                onClick={() => onGrinderSettingChange(setting.value)}
                            >
                                <div className="font-medium">
                                    {setting.name_ko || setting.name}: <span className="text-primary">{setting.value}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">{setting.description_ko || setting.description}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
} 