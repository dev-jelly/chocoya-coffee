import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 그라인더 관리 */}
        <div className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
          <h2 className="text-xl font-semibold">그라인더 관리</h2>
          <p className="text-sm mt-2">그라인더 및 분쇄도 설정 관리</p>
          <a href="/admin/grinders" className="text-blue-500 mt-4 inline-block">관리하기 →</a>
        </div>
        
        {/* 원두 관리 */}
        <div className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
          <h2 className="text-xl font-semibold">원두 관리</h2>
          <p className="text-sm mt-2">원두 정보 및 로스팅 관리</p>
          <a href="/admin/beans" className="text-blue-500 mt-4 inline-block">관리하기 →</a>
        </div>
        
        {/* 제품 관리 */}
        <div className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
          <h2 className="text-xl font-semibold">제품 관리</h2>
          <p className="text-sm mt-2">장비 및 제품 카탈로그 관리</p>
          <a href="/admin/products" className="text-blue-500 mt-4 inline-block">관리하기 →</a>
        </div>
      </div>
    </div>
  );
} 