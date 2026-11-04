import type { Metadata } from 'next';
import PreorderFlow from '@/components/preorder/PreorderFlow';

export const metadata: Metadata = {
  title: 'พรีออเดอร์ • Mood W(h)ich',
  description: 'สั่งแซนวิชตามอารมณ์ล่วงหน้า โอนผ่านพร้อมเพย์ แนบสลิป แล้วรับแซนวิชในวันงาน 12 พ.ย. 2569',
};

export default async function PreorderPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // The quiz result links here with ?preset=happy or ?preset=happy+angry so that sandwich is already picked.
  const { preset } = await searchParams;
  return <PreorderFlow preset={typeof preset === 'string' ? preset : undefined} />;
}
