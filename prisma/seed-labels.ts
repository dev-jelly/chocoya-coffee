import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// JSON 파일에서 맛 노트 레이블 데이터 가져오기
const flavorLabelsPath = path.join(__dirname, '../src/data/flavor-labels.json');
const flavorLabelsJson = JSON.parse(fs.readFileSync(flavorLabelsPath, 'utf8'));
const flavorLabels = flavorLabelsJson.flavorLabels;

async function main() {
  console.log('맛 노트 레이블 시드 데이터 추가 시작...');

  // 맛 노트 레이블 추가
  for (const label of flavorLabels) {
    await prisma.tasteNoteLabel.upsert({
      where: { name: label.name },
      update: {
        color: label.color,
        description: label.description,
      },
      create: {
        name: label.name,
        color: label.color,
        description: label.description || null,
      },
    });
  }

  console.log(`${flavorLabels.length}개의 맛 노트 레이블이 추가되었습니다.`);
}

main()
  .catch((e) => {
    console.error('맛 노트 레이블 시드 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 