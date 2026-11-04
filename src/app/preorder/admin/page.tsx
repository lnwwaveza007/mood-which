import type { Metadata } from 'next';
import OrdersPanel from '@/components/preorder/OrdersPanel';

export const metadata: Metadata = {
  title: 'Pre-order Admin • MoodWhich',
  robots: { index: false, follow: false },
};

export default function PreorderAdminPage() {
  return <OrdersPanel />;
}
