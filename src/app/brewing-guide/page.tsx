import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Droplet, Clock, Scale, ThermometerSnowflake, Check } from 'lucide-react';

export const metadata = {
  title: '커피 브루잉 가이드 | 초코야 커피',
  description: '커피 브루잉의 기본 요소와 팁을 알아보세요',
};

export default function BrewingGuidePage() {
  return (
    <div className="container mx-auto py-10">
      <Link href="/recipes" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        레시피 목록으로 돌아가기
      </Link>
      
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <Coffee className="mr-2" />
        커피 브루잉 가이드
      </h1>
      <p className="text-muted-foreground mb-8">
        완벽한 한 잔의 커피를 만들기 위한 기본 원칙과 팁을 소개합니다.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* 브루잉의 기본 요소 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">브루잉의 기본 요소</h2>
            <p className="mb-6">
              맛있는 커피를 추출하기 위해서는 여러 요소들이 조화롭게 균형을 이루어야 합니다. 
              아래 다섯 가지 요소를 이해하고 조절하는 것이 중요합니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Scale className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">원두량</h3>
                  <p className="text-sm text-muted-foreground">
                    일반적으로 물 100ml당 6-7g의 원두를 사용합니다. 
                    더 진한 맛을 원한다면 비율을 높이고, 부드러운 맛을 원한다면 비율을 낮추세요.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Coffee className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">분쇄도</h3>
                  <p className="text-sm text-muted-foreground">
                    추출 방식에 따라 적절한 분쇄도가 다릅니다. 에스프레소는 매우 고운 분쇄, 
                    핸드드립은 중간, 프렌치프레스는 굵은 분쇄가 적합합니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Droplet className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">물의 질</h3>
                  <p className="text-sm text-muted-foreground">
                    물은 커피의 맛을 결정하는 중요한 요소입니다. 
                    미네랄이 적당히 함유된 깨끗한 물을 사용하고, 염소 냄새가 나는 수돗물은 피하세요.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <ThermometerSnowflake className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">물 온도</h3>
                  <p className="text-sm text-muted-foreground">
                    이상적인 추출 온도는 88-96°C입니다. 온도가 너무 높으면 쓴맛이, 
                    너무 낮으면 신맛이 강해질 수 있습니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">추출 시간</h3>
                  <p className="text-sm text-muted-foreground">
                    추출 시간이 길수록 더 많은 성분이 추출됩니다. 
                    시간이 너무 길면 쓴맛이, 너무 짧으면 산미가 강해질 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 브루잉 방식 비교 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">브루잉 방식 비교</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">추출 방식</th>
                    <th className="py-2 px-4 text-left">분쇄도</th>
                    <th className="py-2 px-4 text-left">물 온도</th>
                    <th className="py-2 px-4 text-left">추출 시간</th>
                    <th className="py-2 px-4 text-left">맛 특성</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">핸드드립</td>
                    <td className="py-3 px-4">중간</td>
                    <td className="py-3 px-4">90-96°C</td>
                    <td className="py-3 px-4">2-3분</td>
                    <td className="py-3 px-4">깔끔하고 선명한 맛, 산미 강조</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">에어로프레스</td>
                    <td className="py-3 px-4">중간-고운</td>
                    <td className="py-3 px-4">85-90°C</td>
                    <td className="py-3 px-4">1-2분</td>
                    <td className="py-3 px-4">부드럽고 깨끗한 맛, 다재다능</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">프렌치프레스</td>
                    <td className="py-3 px-4">굵은</td>
                    <td className="py-3 px-4">93-96°C</td>
                    <td className="py-3 px-4">4분</td>
                    <td className="py-3 px-4">풍부한 바디감, 오일리한 텍스처</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">콜드브루</td>
                    <td className="py-3 px-4">중간-굵은</td>
                    <td className="py-3 px-4">실온</td>
                    <td className="py-3 px-4">12-24시간</td>
                    <td className="py-3 px-4">부드럽고 달콤한 맛, 낮은 산미</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">모카포트</td>
                    <td className="py-3 px-4">중간-고운</td>
                    <td className="py-3 px-4">가열됨</td>
                    <td className="py-3 px-4">3-5분</td>
                    <td className="py-3 px-4">강하고 진한 풍미, 에스프레소와 유사</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* 분쇄도 가이드 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">분쇄도 가이드</h2>
            <p className="mb-6">
              올바른 분쇄도는 커피 추출에 있어 가장 중요한 요소 중 하나입니다. 
              사용하는 추출 방식에 맞는 분쇄도를 선택하세요.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                    <span className="text-xs">매우 고운</span>
                  </div>
                  <span className="font-medium">에스프레소, 터키쉬 커피</span>
                </div>
                <p className="text-sm text-muted-foreground">밀가루와 유사한 아주 고운 입자</p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                    <span className="text-xs">고운</span>
                  </div>
                  <span className="font-medium">모카포트, 에스프레소 머신</span>
                </div>
                <p className="text-sm text-muted-foreground">모래보다 약간 굵은 정도</p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                    <span className="text-xs">중간-고운</span>
                  </div>
                  <span className="font-medium">에어로프레스, 사이폰</span>
                </div>
                <p className="text-sm text-muted-foreground">고운 모래와 유사한 입자</p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                    <span className="text-xs">중간</span>
                  </div>
                  <span className="font-medium">핸드드립(V60, 칼리타), 드립 머신</span>
                </div>
                <p className="text-sm text-muted-foreground">굵은 모래/가는 소금과 유사한 입자</p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                    <span className="text-xs">중간-굵은</span>
                  </div>
                  <span className="font-medium">케멕스, 클레버</span>
                </div>
                <p className="text-sm text-muted-foreground">굵은 소금과 유사한 입자</p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
                    <span className="text-xs">굵은</span>
                  </div>
                  <span className="font-medium">프렌치프레스, 콜드브루</span>
                </div>
                <p className="text-sm text-muted-foreground">굵게 갈은 후추와 유사한 입자</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* 팁 카드 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">브루잉 팁</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check size={18} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">신선한 원두를 사용하세요. 로스팅 후 2주 이내의 원두가 가장 좋습니다.</p>
              </li>
              <li className="flex items-start">
                <Check size={18} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">추출 직전에 원두를 갈아 신선도를 유지하세요.</p>
              </li>
              <li className="flex items-start">
                <Check size={18} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">물의 온도를 일정하게 유지하기 위해 온도계를 사용해보세요.</p>
              </li>
              <li className="flex items-start">
                <Check size={18} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">정확한 계량을 위해 디지털 저울을 사용하는 것이 좋습니다.</p>
              </li>
              <li className="flex items-start">
                <Check size={18} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">블루밍(뜸들이기)은 이산화탄소를 방출하고 균일한 추출을 돕습니다.</p>
              </li>
              <li className="flex items-start">
                <Check size={18} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">추출 시간을 기록하고 맛과의 관계를 파악해 자신만의 레시피를 만드세요.</p>
              </li>
            </ul>
          </div>
          
          {/* 물 온도 가이드 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">물 온도 가이드</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">라이트 로스트</span>
                  <span className="text-sm text-muted-foreground">94-96°C</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '95%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  산미가 강한 밝은 로스팅 원두에는 높은 온도가 적합합니다.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">미디엄 로스트</span>
                  <span className="text-sm text-muted-foreground">90-94°C</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  균형 잡힌 맛의 중간 로스팅 원두에 적합한 온도입니다.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">다크 로스트</span>
                  <span className="text-sm text-muted-foreground">88-90°C</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  쓴맛을 줄이기 위해 어두운 로스팅 원두는 낮은 온도로 추출합니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 실전 연습 링크 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">실전에서 배우기</h2>
            <p className="text-sm text-muted-foreground mb-4">
              이론을 익혔다면 이제 실제 레시피를 통해 연습해보세요. 
              다양한 방식의 추출법을 시도하고 기록하며 자신만의 취향을 찾아가는 것이 중요합니다.
            </p>
            <div className="space-y-2">
              <Link 
                href="/recipes" 
                className="block w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center"
              >
                레시피 둘러보기
              </Link>
              <Link 
                href="/recipes/create" 
                className="block w-full py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-center"
              >
                나만의 레시피 공유하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 