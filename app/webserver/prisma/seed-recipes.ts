const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedRecipes() {
  try {
    // 관리자 이메일을 환경 변수에서 가져옴
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chocoya.coffee';
    
    // 관리자 사용자 찾기
    const admin = await prisma.user.findFirst({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.error(`관리자 계정(${adminEmail})을 찾을 수 없습니다. 먼저 seed.ts를 실행해주세요.`);
      return;
    }

    const adminId = admin.id;

    // 1. 에스프레소 레시피
    const espressoRecipe = await prisma.recipe.upsert({
      where: { id: 'classic-espresso-recipe' },
      update: {},
      create: {
        id: 'classic-espresso-recipe',
        title: '클래식 에스프레소',
        description: '진한 풍미와 크레마가 특징인 기본 에스프레소 레시피입니다.',
        isPublic: true,
        brewingMethod: '에스프레소',
        difficulty: '중급',
        preparationTime: '25-30초',
        beanAmount: '18g',
        waterAmount: '36ml',
        waterTemp: '92-94°C',
        grindSize: '고운 분쇄',
        tools: '에스프레소 머신, 그라인더, 탬퍼, 스케일',
        acidity: '낮음',
        sweetness: '중간',
        body: '높음',
        recommendedBeans: '브라질 산토스, 콜롬비아 수프리모',
        userId: adminId,
      },
    });

    // 에스프레소 레시피 단계
    await prisma.step.deleteMany({
      where: { recipeId: espressoRecipe.id },
    });

    const espressoSteps = [
      {
        recipeId: espressoRecipe.id,
        order: 1,
        description: '원두 18g을 고운 입자로 분쇄합니다.',
        time: '30초',
      },
      {
        recipeId: espressoRecipe.id,
        order: 2,
        description: '포타필터에 분쇄된 원두를 담고 평평하게 정리합니다.',
        time: '10초',
      },
      {
        recipeId: espressoRecipe.id,
        order: 3,
        description: '탬퍼로 일정한 압력을 가해 원두를 눌러줍니다.',
        time: '10초',
      },
      {
        recipeId: espressoRecipe.id,
        order: 4,
        description: '포타필터를 에스프레소 머신에 장착하고 추출을 시작합니다.',
        time: '25-30초',
        waterAmount: '36ml',
      },
      {
        recipeId: espressoRecipe.id,
        order: 5,
        description: '36ml가 추출되면 즉시 추출을 중단합니다.',
        time: '5초',
      },
    ];

    for (const step of espressoSteps) {
      await prisma.step.create({
        data: step,
      });
    }

    // 에스프레소 브루잉 팁
    await prisma.brewingTip.deleteMany({
      where: { recipeId: espressoRecipe.id },
    });

    const espressoTips = [
      {
        recipeId: espressoRecipe.id,
        content: '원두는 로스팅 후 5-14일 사이의 것을 사용하는 것이 좋습니다.',
      },
      {
        recipeId: espressoRecipe.id,
        content: '추출 시간이 20초 미만이면 분쇄도를 더 곱게, 35초 이상이면 더 굵게 조절하세요.',
      },
      {
        recipeId: espressoRecipe.id,
        content: '탬핑 압력은 약 15-20kg 정도로 일정하게 유지하는 것이 중요합니다.',
      },
    ];

    for (const tip of espressoTips) {
      await prisma.brewingTip.create({
        data: tip,
      });
    }

    // 2. 아이스 드립 레시피
    const iceDripRecipe = await prisma.recipe.upsert({
      where: { id: 'japanese-iced-coffee-recipe' },
      update: {},
      create: {
        id: 'japanese-iced-coffee-recipe',
        title: '일본식 아이스 드립 커피',
        description: '얼음 위에 직접 드립하여 신선한 풍미를 유지하는 아이스 커피 레시피입니다.',
        isPublic: true,
        brewingMethod: '아이스 드립',
        difficulty: '초급',
        preparationTime: '3-4분',
        beanAmount: '22g',
        waterAmount: '350ml (물 200ml + 얼음 150g)',
        waterTemp: '94-96°C',
        grindSize: '중간-고운 분쇄',
        tools: '드리퍼, 필터, 서버, 주전자, 저울, 얼음',
        acidity: '높음',
        sweetness: '중간-높음',
        body: '가벼움',
        recommendedBeans: '에티오피아 예가체프, 케냐 AA, 과테말라 안티구아',
        userId: adminId,
      },
    });

    // 아이스 드립 레시피 단계
    await prisma.step.deleteMany({
      where: { recipeId: iceDripRecipe.id },
    });

    const iceDripSteps = [
      {
        recipeId: iceDripRecipe.id,
        order: 1,
        description: '서버에 150g의 얼음을 넣습니다.',
        time: '10초',
      },
      {
        recipeId: iceDripRecipe.id,
        order: 2,
        description: '드리퍼에 필터를 세팅하고 뜨거운 물로 필터를 적셔줍니다.',
        time: '30초',
      },
      {
        recipeId: iceDripRecipe.id,
        order: 3,
        description: '분쇄된 원두 22g을 드리퍼에 넣고 평평하게 만듭니다.',
        time: '10초',
      },
      {
        recipeId: iceDripRecipe.id,
        order: 4,
        description: '원두 중앙에 40ml의 물을 부어 블루밍을 시작합니다.',
        time: '45초',
        waterAmount: '40ml',
      },
      {
        recipeId: iceDripRecipe.id,
        order: 5,
        description: '원을 그리며 천천히 100ml까지 물을 부어줍니다.',
        time: '30초',
        waterAmount: '60ml',
      },
      {
        recipeId: iceDripRecipe.id,
        order: 6,
        description: '물이 절반 정도 내려가면 150ml까지 물을 부어줍니다.',
        time: '30초',
        waterAmount: '50ml',
      },
      {
        recipeId: iceDripRecipe.id,
        order: 7,
        description: '마지막으로 200ml까지 물을 부어 추출을 완료합니다.',
        time: '30초',
        waterAmount: '50ml',
      },
    ];

    for (const step of iceDripSteps) {
      await prisma.step.create({
        data: step,
      });
    }

    // 아이스 드립 브루잉 팁
    await prisma.brewingTip.deleteMany({
      where: { recipeId: iceDripRecipe.id },
    });

    const iceDripTips = [
      {
        recipeId: iceDripRecipe.id,
        content: '얼음이 완전히 녹으면 약 350ml의 아이스 커피가 됩니다.',
      },
      {
        recipeId: iceDripRecipe.id,
        content: '일반 드립보다 원두를 약간 더 많이 사용하여 얼음으로 인한 희석을 보완합니다.',
      },
      {
        recipeId: iceDripRecipe.id,
        content: '산미가 좋은 원두를 사용하면 더 상쾌한 아이스 커피를 즐길 수 있습니다.',
      },
    ];

    for (const tip of iceDripTips) {
      await prisma.brewingTip.create({
        data: tip,
      });
    }

    // 3. 프렌치 프레스 레시피
    const frenchPressRecipe = await prisma.recipe.upsert({
      where: { id: 'classic-french-press-recipe' },
      update: {},
      create: {
        id: 'classic-french-press-recipe',
        title: '클래식 프렌치 프레스',
        description: '풍부한 바디감과 오일을 느낄 수 있는 침지식 추출 방법입니다.',
        isPublic: true,
        brewingMethod: '프렌치 프레스',
        difficulty: '초급',
        preparationTime: '4-5분',
        beanAmount: '30g',
        waterAmount: '500ml',
        waterTemp: '93-95°C',
        grindSize: '굵은 분쇄',
        tools: '프렌치 프레스, 저울, 타이머, 주전자',
        acidity: '낮음',
        sweetness: '중간',
        body: '높음',
        recommendedBeans: '브라질 세하도, 인도네시아 만델링, 과테말라 안티구아',
        userId: adminId,
      },
    });

    // 프렌치 프레스 레시피 단계
    await prisma.step.deleteMany({
      where: { recipeId: frenchPressRecipe.id },
    });

    const frenchPressSteps = [
      {
        recipeId: frenchPressRecipe.id,
        order: 1,
        description: '프렌치 프레스를 뜨거운 물로 예열합니다.',
        time: '30초',
      },
      {
        recipeId: frenchPressRecipe.id,
        order: 2,
        description: '예열된 물을 버리고 분쇄된 원두 30g을 프렌치 프레스에 넣습니다.',
        time: '10초',
      },
      {
        recipeId: frenchPressRecipe.id,
        order: 3,
        description: '93-95°C의 물 500ml를 부어 원두를 적십니다.',
        time: '20초',
        waterAmount: '500ml',
      },
      {
        recipeId: frenchPressRecipe.id,
        order: 4,
        description: '스푼으로 상단의 크러스트를 부드럽게 저어줍니다.',
        time: '10초',
      },
      {
        recipeId: frenchPressRecipe.id,
        order: 5,
        description: '뚜껑을 덮고 플런저를 내리지 않은 상태로 4분간 기다립니다.',
        time: '4분',
      },
      {
        recipeId: frenchPressRecipe.id,
        order: 6,
        description: '플런저를 천천히 내려 추출을 완료합니다.',
        time: '20초',
      },
    ];

    for (const step of frenchPressSteps) {
      await prisma.step.create({
        data: step,
      });
    }

    // 프렌치 프레스 브루잉 팁
    await prisma.brewingTip.deleteMany({
      where: { recipeId: frenchPressRecipe.id },
    });

    const frenchPressTips = [
      {
        recipeId: frenchPressRecipe.id,
        content: '원두는 반드시 굵게 분쇄해야 과다 추출을 방지할 수 있습니다.',
      },
      {
        recipeId: frenchPressRecipe.id,
        content: '플런저를 내릴 때는 천천히 일정한 속도로 내려야 원두 가루가 올라오지 않습니다.',
      },
      {
        recipeId: frenchPressRecipe.id,
        content: '추출 후 바로 컵에 따라 과다 추출을 방지하세요.',
      },
    ];

    for (const tip of frenchPressTips) {
      await prisma.brewingTip.create({
        data: tip,
      });
    }

    // 4. 에어로프레스 레시피
    const aeropressRecipe = await prisma.recipe.upsert({
      where: { id: 'inverted-aeropress-recipe' },
      update: {},
      create: {
        id: 'inverted-aeropress-recipe',
        title: '인버티드 에어로프레스',
        description: '역방향 추출로 더 풍부한 맛을 내는 에어로프레스 레시피입니다.',
        isPublic: true,
        brewingMethod: '에어로프레스',
        difficulty: '중급',
        preparationTime: '1-2분',
        beanAmount: '17g',
        waterAmount: '250ml',
        waterTemp: '85-88°C',
        grindSize: '중간-고운 분쇄',
        tools: '에어로프레스, 필터, 저울, 타이머, 주전자, 스푼',
        acidity: '중간-높음',
        sweetness: '높음',
        body: '중간',
        recommendedBeans: '에티오피아 예가체프, 코스타리카 타라주, 케냐 AA',
        userId: adminId,
      },
    });

    // 에어로프레스 레시피 단계
    await prisma.step.deleteMany({
      where: { recipeId: aeropressRecipe.id },
    });

    const aeropressSteps = [
      {
        recipeId: aeropressRecipe.id,
        order: 1,
        description: '에어로프레스를 역방향으로 조립하고 플런저를 약간 삽입합니다.',
        time: '10초',
      },
      {
        recipeId: aeropressRecipe.id,
        order: 2,
        description: '분쇄된 원두 17g을 에어로프레스에 넣습니다.',
        time: '10초',
      },
      {
        recipeId: aeropressRecipe.id,
        order: 3,
        description: '85-88°C의 물 50ml를 부어 블루밍을 시작합니다.',
        time: '30초',
        waterAmount: '50ml',
      },
      {
        recipeId: aeropressRecipe.id,
        order: 4,
        description: '나머지 물 200ml를 부어 총 250ml를 채웁니다.',
        time: '10초',
        waterAmount: '200ml',
      },
      {
        recipeId: aeropressRecipe.id,
        order: 5,
        description: '스푼으로 가볍게 저어줍니다.',
        time: '5초',
      },
      {
        recipeId: aeropressRecipe.id,
        order: 6,
        description: '필터를 캡에 장착하고 물로 적신 후 에어로프레스에 돌려 끼웁니다.',
        time: '15초',
      },
      {
        recipeId: aeropressRecipe.id,
        order: 7,
        description: '에어로프레스를 컵 위에 뒤집고 천천히 압력을 가해 추출합니다.',
        time: '20-30초',
      },
    ];

    for (const step of aeropressSteps) {
      await prisma.step.create({
        data: step,
      });
    }

    // 에어로프레스 브루잉 팁
    await prisma.brewingTip.deleteMany({
      where: { recipeId: aeropressRecipe.id },
    });

    const aeropressTips = [
      {
        recipeId: aeropressRecipe.id,
        content: '뒤집을 때 새지 않도록 캡을 단단히 조여주세요.',
      },
      {
        recipeId: aeropressRecipe.id,
        content: '압력을 가할 때는 일정하게 천천히 눌러 15-20초 정도 소요되도록 합니다.',
      },
      {
        recipeId: aeropressRecipe.id,
        content: '더 산미가 강한 커피를 원한다면 물 온도를 90-92°C로 높여보세요.',
      },
    ];

    for (const tip of aeropressTips) {
      await prisma.brewingTip.create({
        data: tip,
      });
    }

    // 5. 콜드 브루 레시피
    const coldBrewRecipe = await prisma.recipe.upsert({
      where: { id: 'smooth-cold-brew-recipe' },
      update: {},
      create: {
        id: 'smooth-cold-brew-recipe',
        title: '부드러운 콜드 브루',
        description: '장시간 침출로 부드럽고 달콤한 풍미를 가진 콜드 브루 레시피입니다.',
        isPublic: true,
        brewingMethod: '콜드 브루',
        difficulty: '초급',
        preparationTime: '12-24시간',
        beanAmount: '100g',
        waterAmount: '1000ml',
        waterTemp: '실온',
        grindSize: '중간-굵은 분쇄',
        tools: '메이슨 자, 필터, 저울',
        acidity: '낮음',
        sweetness: '높음',
        body: '중간-높음',
        recommendedBeans: '브라질 세하도, 콜롬비아 수프리모, 과테말라 안티구아',
        userId: adminId,
      },
    });

    // 콜드 브루 레시피 단계
    await prisma.step.deleteMany({
      where: { recipeId: coldBrewRecipe.id },
    });

    const coldBrewSteps = [
      {
        recipeId: coldBrewRecipe.id,
        order: 1,
        description: '원두 100g을 중간-굵은 입자로 분쇄합니다.',
        time: '1분',
      },
      {
        recipeId: coldBrewRecipe.id,
        order: 2,
        description: '메이슨 자에 분쇄된 원두를 넣습니다.',
        time: '10초',
      },
      {
        recipeId: coldBrewRecipe.id,
        order: 3,
        description: '실온의 물 1000ml를 천천히 부어 모든 원두가 젖도록 합니다.',
        time: '1분',
        waterAmount: '1000ml',
      },
      {
        recipeId: coldBrewRecipe.id,
        order: 4,
        description: '가볍게 저어준 후 뚜껑을 닫습니다.',
        time: '20초',
      },
      {
        recipeId: coldBrewRecipe.id,
        order: 5,
        description: '실온에서 12시간 또는 냉장고에서 24시간 동안 추출합니다.',
        time: '12-24시간',
      },
      {
        recipeId: coldBrewRecipe.id,
        order: 6,
        description: '필터나 천으로 커피를 걸러냅니다.',
        time: '5분',
      },
      {
        recipeId: coldBrewRecipe.id,
        order: 7,
        description: '깨끗한 병에 옮겨 담아 냉장 보관합니다.',
        time: '1분',
      },
    ];

    for (const step of coldBrewSteps) {
      await prisma.step.create({
        data: step,
      });
    }

    // 콜드 브루 브루잉 팁
    await prisma.brewingTip.deleteMany({
      where: { recipeId: coldBrewRecipe.id },
    });

    const coldBrewTips = [
      {
        recipeId: coldBrewRecipe.id,
        content: '콜드 브루는 농축액으로 만들어 물이나 우유로 희석해 마실 수 있습니다.',
      },
      {
        recipeId: coldBrewRecipe.id,
        content: '냉장 보관 시 1주일까지 신선하게 유지됩니다.',
      },
      {
        recipeId: coldBrewRecipe.id,
        content: '다크 로스트 원두를 사용하면 더 달콤하고 초콜릿 같은 풍미를 얻을 수 있습니다.',
      },
    ];

    for (const tip of coldBrewTips) {
      await prisma.brewingTip.create({
        data: tip,
      });
    }

    console.log('커피 레시피 시드 데이터 생성 완료!');
  } catch (error) {
    console.error('레시피 시드 데이터 생성 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 모듈 형식으로 실행
seedRecipes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 