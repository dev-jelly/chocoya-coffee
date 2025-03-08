'use client';

import { useState, useEffect, useRef } from 'react';
import { FlavorLabel, flavorWheel, Category, Subcategory, FlavorDetail } from '@/data/flavor-labels';

interface FlavorWheelImageProps {
  selectedLabels?: FlavorLabel[];
  size?: number;
  className?: string;
  interactive?: boolean;
  onSelect?: (categoryPath: string) => void;
}

export function FlavorWheelImage({
  selectedLabels = [],
  size = 500,
  className = '',
  interactive = false,
  onSelect
}: FlavorWheelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // 마우스 위치를 추적하기 위한 상태
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // 각 세그먼트의 위치 및 경로 정보를 저장
  const [segments, setSegments] = useState<{
    path: string;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    color: string;
    level: number;
  }[]>([]);

  // 휠 그리기
  const drawFlavorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 10;

    // 배경 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 타이틀 그리기
    ctx.font = `bold ${maxRadius * 0.05}px Arial`;
    ctx.fillStyle = flavorWheel.title.colorCode;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(flavorWheel.title.ko, centerX, centerY - maxRadius * 0.85);

    // 새 세그먼트 배열 초기화
    const newSegments: typeof segments = [];

    // 첫 번째 레벨 (대분류) 그리기
    const categories = flavorWheel.categories;
    const categoryCount = categories.length;

    categories.forEach((category, i) => {
      const startAngle = (i / categoryCount) * Math.PI * 2;
      const endAngle = ((i + 1) / categoryCount) * Math.PI * 2;
      const outerRadius = maxRadius * 0.8;
      const innerRadius = maxRadius * 0.5;

      // 대분류 세그먼트 그리기
      ctx.beginPath();
      ctx.moveTo(
        centerX + innerRadius * Math.cos(startAngle),
        centerY + innerRadius * Math.sin(startAngle)
      );
      ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, outerRadius, endAngle, startAngle, true);
      ctx.closePath();

      const categoryPath = `${category.name.ko}`;
      const isHovered = hoveredPath === categoryPath;

      // 색상 결정 (호버 시 더 밝게)
      ctx.fillStyle = isHovered ? lightenColor(category.colorCode, 20) : category.colorCode;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 세그먼트 정보 저장
      newSegments.push({
        path: categoryPath,
        startAngle,
        endAngle,
        innerRadius,
        outerRadius,
        color: category.colorCode,
        level: 1
      });

      // 카테고리 이름 그리기
      const labelRadius = (innerRadius + outerRadius) / 2;
      const labelAngle = (startAngle + endAngle) / 2;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      // 텍스트 크기 계산
      const fontSize = Math.min(maxRadius * 0.04, (outerRadius - innerRadius) * 0.6);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = getContrastColor(category.colorCode);

      // 텍스트 회전 및 그리기
      ctx.save();
      ctx.translate(labelX, labelY);

      // 위치에 따라 텍스트 회전 방향 조정
      let rotationAngle = labelAngle;
      if (labelAngle > Math.PI / 2 && labelAngle < Math.PI * 3 / 2) {
        rotationAngle += Math.PI;
      }

      ctx.rotate(rotationAngle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(category.name.ko, 0, 0);
      ctx.restore();

      // 두 번째 레벨 (서브카테고리) 그리기
      if (category.subcategories.length > 0) {
        const subCount = category.subcategories.length;
        const subAngleStep = (endAngle - startAngle) / subCount;

        category.subcategories.forEach((subcategory, j) => {
          const subStartAngle = startAngle + j * subAngleStep;
          const subEndAngle = startAngle + (j + 1) * subAngleStep;
          const subInnerRadius = outerRadius;
          const subOuterRadius = maxRadius * 0.95;

          ctx.beginPath();
          ctx.moveTo(
            centerX + subInnerRadius * Math.cos(subStartAngle),
            centerY + subInnerRadius * Math.sin(subStartAngle)
          );
          ctx.arc(centerX, centerY, subInnerRadius, subStartAngle, subEndAngle);
          ctx.arc(centerX, centerY, subOuterRadius, subEndAngle, subStartAngle, true);
          ctx.closePath();

          const subPath = `${category.name.ko} > ${subcategory.name.ko}`;
          const isSubHovered = hoveredPath === subPath;

          ctx.fillStyle = isSubHovered ? lightenColor(subcategory.colorCode, 20) : subcategory.colorCode;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();

          // 세그먼트 정보 저장
          newSegments.push({
            path: subPath,
            startAngle: subStartAngle,
            endAngle: subEndAngle,
            innerRadius: subInnerRadius,
            outerRadius: subOuterRadius,
            color: subcategory.colorCode,
            level: 2
          });
        });
      }
    });

    // 중앙 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 선택된 향미 표시
    if (selectedLabels.length > 0) {
      // 선택된 향미 이름 목록을 중앙에 표시
      const selectedText = selectedLabels.map(label => label.name).join(', ');
      ctx.font = `bold ${maxRadius * 0.04}px Arial`;
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 텍스트 행 나누기
      const words = selectedText.split(', ');
      let lines: string[] = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine}, ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxRadius * 0.8 && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      // 여러 줄 텍스트 그리기
      const lineHeight = maxRadius * 0.05;
      const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, centerX, startY + i * lineHeight);
      });
    } else {
      // 선택된 향미가 없는 경우 안내 메시지 표시
      ctx.font = `${maxRadius * 0.06}px Arial`;
      ctx.fillStyle = '#999999';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('향미를 선택하세요', centerX, centerY);
    }

    // 세그먼트 정보 업데이트
    setSegments(newSegments);
  };

  // 마우스 움직임 처리
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // 마우스 위치가 어떤 세그먼트에 있는지 확인
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 중심점으로부터의 거리 계산
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 각도 계산 (0 ~ 2PI)
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;

    // 모든 세그먼트 확인
    let foundSegment = null;

    for (const segment of segments) {
      const { startAngle, endAngle, innerRadius, outerRadius } = segment;

      // 각도와 반지름 범위 확인
      const angleInRange = startAngle <= angle && angle <= endAngle;
      const radiusInRange = innerRadius <= distance && distance <= outerRadius;

      if (angleInRange && radiusInRange) {
        foundSegment = segment;
        // 가장 깊은 레벨(바깥쪽) 세그먼트를 우선적으로 찾기
        if (foundSegment.level === 2) break;
      }
    }

    setHoveredPath(foundSegment ? foundSegment.path : null);
  };

  // 마우스 나갔을 때 처리
  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredPath(null);
  };

  // 클릭 처리
  const handleClick = () => {
    if (!interactive || !onSelect || !hoveredPath) return;
    onSelect(hoveredPath);
  };

  // 컴포넌트 마운트 및 업데이트 시 플레이버 휠 그리기
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = size;
      canvasRef.current.height = size;
      drawFlavorWheel();
    }
  }, [size, selectedLabels, hoveredPath]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          cursor: interactive ? 'pointer' : 'default'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {hoveredPath && (
        <div className="mt-2 text-sm text-center font-medium">
          {hoveredPath}
        </div>
      )}
    </div>
  );
}

// 색상을 밝게 하는 유틸리티 함수
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, ((num >> 16) & 0xff) + amt);
  const G = Math.min(255, ((num >> 8) & 0xff) + amt);
  const B = Math.min(255, (num & 0xff) + amt);

  return '#' + (
    0x1000000 +
    (R << 16) +
    (G << 8) +
    B
  ).toString(16).slice(1);
}

// 배경색에 따라 대비되는 텍스트 색상 반환
function getContrastColor(hexColor: string): string {
  // HEX를 RGB로 변환
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // 밝기 계산 (YIQ 공식)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 밝기에 따라 검정 또는 흰색 반환
  return brightness > 128 ? '#000000' : '#FFFFFF';
} 