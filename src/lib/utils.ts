import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 한국어 형식(YYYY년 MM월 DD일)으로 포맷팅합니다.
 * @param date 포맷팅할 날짜 (Date 객체 또는 유효한 Date 생성자 파라미터)
 * @param options 포맷팅 옵션
 * @returns 포맷팅된 날짜 문자열
 */
export function formatKoreanDate(
  date: Date | string | number,
  options: {
    showYear?: boolean;
    showMonth?: boolean;
    showDay?: boolean;
    showTime?: boolean;
    showWeekday?: boolean;
  } = {}
) {
  const {
    showYear = true,
    showMonth = true,
    showDay = true,
    showTime = false,
    showWeekday = false,
  } = options;

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return '날짜 정보 없음';
    }

    // 한국어 요일
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[dateObj.getDay()];

    let formattedDate = '';

    if (showYear) {
      formattedDate += `${dateObj.getFullYear()}년 `;
    }

    if (showMonth) {
      formattedDate += `${dateObj.getMonth() + 1}월 `;
    }

    if (showDay) {
      formattedDate += `${dateObj.getDate()}일`;
    }

    if (showWeekday) {
      formattedDate += ` (${weekday})`;
    }

    if (showTime) {
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      const ampm = hours < 12 ? '오전' : '오후';
      const hour12 = hours % 12 || 12;
      formattedDate += ` ${ampm} ${hour12}시 ${minutes.toString().padStart(2, '0')}분`;
    }

    return formattedDate.trim();
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '날짜 정보 없음';
  }
}
