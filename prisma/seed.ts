const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 관리자 계정 생성 (이미 존재하는 경우 업데이트)
  const adminEmail = 'admin@chocoya.coffee';
  
  const hashedPassword = await bcrypt.hash('admin1234', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: '초코야 관리자',
      password: hashedPassword,
    },
  });
  
  console.log(`관리자 계정 생성 완료: ${admin.id}`);
  
  // 기본 핸드드립 레시피 추가
  const basicHandDripRecipe = await prisma.recipe.upsert({
    where: { id: 'basic-hand-drip-recipe' },
    update: {},
    create: {
      id: 'basic-hand-drip-recipe',
      title: '기본 핸드드립 레시피',
      description: '초보자도 쉽게 따라할 수 있는 기본 핸드드립 레시피입니다. 균형 잡힌 맛을 추출하는 것을 목표로 합니다.',
      isPublic: true,
      brewingMethod: '핸드드립',
      difficulty: '초급',
      preparationTime: '3~4분',
      beanAmount: '15g',
      waterAmount: '250ml',
      waterTemp: '90-92°C',
      grindSize: '중간',
      tools: '드리퍼, 필터, 서버, 주전자, 저울',
      acidity: '중간',
      sweetness: '중간-높음',
      body: '중간',
      recommendedBeans: '에티오피아 예가체프, 과테말라 안티구아',
      userId: admin.id,
    },
  });
  
  // 레시피 단계 추가
  await prisma.step.deleteMany({
    where: { recipeId: basicHandDripRecipe.id },
  });
  
  const steps = [
    {
      recipeId: basicHandDripRecipe.id,
      order: 1,
      description: '필터를 드리퍼에 세팅하고 뜨거운 물로 필터를 적셔줍니다.',
      time: '30초',
    },
    {
      recipeId: basicHandDripRecipe.id,
      order: 2,
      description: '분쇄된 원두 15g을 드리퍼에 넣고 평평하게 만듭니다.',
      time: '10초',
    },
    {
      recipeId: basicHandDripRecipe.id,
      order: 3,
      description: '원두 중앙에 30ml의 물을 부어 블루밍을 시작합니다.',
      time: '30초',
      waterAmount: '30ml',
    },
    {
      recipeId: basicHandDripRecipe.id,
      order: 4,
      description: '원을 그리며 천천히 100ml까지 물을 부어줍니다.',
      time: '30초',
      waterAmount: '70ml',
    },
    {
      recipeId: basicHandDripRecipe.id,
      order: 5,
      description: '물이 절반 정도 내려가면 다시 180ml까지 물을 부어줍니다.',
      time: '30초',
      waterAmount: '80ml',
    },
    {
      recipeId: basicHandDripRecipe.id,
      order: 6,
      description: '마지막으로 250ml까지 물을 부어 추출을 완료합니다.',
      time: '60초',
      waterAmount: '70ml',
    },
  ];
  
  for (const step of steps) {
    await prisma.step.create({
      data: step,
    });
  }
  
  // 브루잉 팁 추가
  await prisma.brewingTip.deleteMany({
    where: { recipeId: basicHandDripRecipe.id },
  });
  
  const tips = [
    {
      recipeId: basicHandDripRecipe.id,
      content: '물을 부을 때는 원두 위에서 너무 높지 않게 조절하여 부어주세요.',
    },
    {
      recipeId: basicHandDripRecipe.id,
      content: '블루밍 시간은 원두의 신선도에 따라 조절할 수 있습니다. 로스팅 후 일주일 이내의 원두는 30-45초, 오래된 원두는 20-30초 정도가 적당합니다.',
    },
    {
      recipeId: basicHandDripRecipe.id,
      content: '전체 추출 시간은 2분 30초에서 3분 사이가 이상적입니다.',
    },
  ];
  
  for (const tip of tips) {
    await prisma.brewingTip.create({
      data: tip,
    });
  }
  
  console.log(`기본 핸드드립 레시피 생성 완료: ${basicHandDripRecipe.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 