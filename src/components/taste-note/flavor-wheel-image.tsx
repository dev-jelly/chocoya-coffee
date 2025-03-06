'use client';

import { useState, useEffect, useRef } from 'react';
import { FlavorLabel } from '@/data/flavor-labels';

interface FlavorWheelImageProps {
  selectedLabels: FlavorLabel[];
  size?: number;
  className?: string;
}

export function FlavorWheelImage({ selectedLabels, size = 300, className = '' }: FlavorWheelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 색상 혼합 함수
  const blendColors = (colors: string[]): string => {
    if (colors.length === 0) return '#CCCCCC';
    if (colors.length === 1) return colors[0];
    
    let r = 0, g = 0, b = 0;
    
    colors.forEach(color => {
      // HEX 색상을 RGB로 변환
      const hex = color.replace('#', '');
      const bigint = parseInt(hex, 16);
      const rr = (bigint >> 16) & 255;
      const gg = (bigint >> 8) & 255;
      const bb = bigint & 255;
      
      r += rr;
      g += gg;
      b += bb;
    });
    
    // 평균 계산
    r = Math.round(r / colors.length);
    g = Math.round(g / colors.length);
    b = Math.round(b / colors.length);
    
    // RGB를 HEX로 변환
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  // 맛 노트를 시각화하여 그리기
  const drawFlavorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 원 그리기
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (selectedLabels.length === 0) {
      // 선택된 레이블이 없을 때 물음표 그리기
      ctx.font = `${canvas.width / 6}px sans-serif`;
      ctx.fillStyle = '#adb5bd';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // 선택된 레이블들의 색상 목록
    const colors = selectedLabels.map(label => label.color);
    
    // 맛 노트 개수에 따라 다른 시각화
    if (selectedLabels.length === 1) {
      // 하나의 맛 노트만 선택된 경우 중앙에 원 하나
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, Math.PI * 2);
      ctx.fillStyle = colors[0];
      ctx.fill();
      
      // 텍스트 추가
      ctx.font = `${canvas.width / 14}px sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedLabels[0].name, canvas.width / 2, canvas.height / 2);
    } else {
      // 여러 맛 노트가 선택된 경우 색상을 혼합하여 중앙에 표시하고 둘러싼 작은 원들에 각 맛 노트 표시
      const centerColor = blendColors(colors);
      
      // 중앙 원 그리기
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 4, 0, Math.PI * 2);
      ctx.fillStyle = centerColor;
      ctx.fill();
      
      // 주변에 각 맛 노트 원 그리기
      const totalLabels = Math.min(selectedLabels.length, 8); // 최대 8개까지 표시
      const radius = canvas.width / 3;
      
      for (let i = 0; i < totalLabels; i++) {
        const angle = (i * 2 * Math.PI) / totalLabels;
        const x = canvas.width / 2 + radius * Math.cos(angle);
        const y = canvas.height / 2 + radius * Math.sin(angle);
        
        // 작은 원 그리기
        ctx.beginPath();
        ctx.arc(x, y, canvas.width / 12, 0, Math.PI * 2);
        ctx.fillStyle = selectedLabels[i].color;
        ctx.fill();
        
        // 연결선 그리기
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedLabels[i].color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };
  
  // 맛 노트 변경 시 다시 그리기
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = size;
      canvasRef.current.height = size;
      drawFlavorWheel();
    }
  }, [selectedLabels, size]);
  
  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
    </div>
  );
} 