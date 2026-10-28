import type { Metadata } from 'next';
import { MOOD_PROFILES, MoodType } from '@/data/quizData';
import DrawFlow from '@/components/draw/DrawFlow';

export const metadata: Metadata = {
  title: 'Lucky Draw • MoodWhich',
  description: 'แท็ก IG ลุ้นครึ่งชิ้นฟรี รางวัลจำกัด 10 รางวัล',
};

// /draw?mood=<id> — the quiz result page passes the customer's mood along.
export default async function DrawPage({ searchParams }: { searchParams: Promise<{ mood?: string }> }) {
  const { mood } = await searchParams;
  const id: MoodType = mood && mood in MOOD_PROFILES ? (mood as MoodType) : 'happy';
  return <DrawFlow mood={id} />;
}
