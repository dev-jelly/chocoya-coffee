'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteBean } from '@/lib/actions/bean';
import { useToast } from '@/components/ui/use-toast';

interface DeleteBeanButtonProps {
  beanId: string;
  userId: string;
}

export default function DeleteBeanButton({ beanId, userId }: DeleteBeanButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 삭제 확인
    const confirmed = window.confirm('정말로 이 원두 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteBean(beanId, userId);

      if (result.success) {
        toast({
          title: '원두 정보 삭제 성공',
          description: '원두 정보가 성공적으로 삭제되었습니다.',
        });
        router.push('/beans');
      } else {
        toast({
          title: '원두 정보 삭제 실패',
          description: result.message || '원두 정보를 삭제하는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting bean:', error);
      toast({
        title: '원두 정보 삭제 실패',
        description: '서버 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
      title="원두 정보 삭제"
    >
      <Trash2 size={16} />
    </button>
  );
} 