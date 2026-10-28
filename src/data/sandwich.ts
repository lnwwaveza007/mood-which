import { BASE_SANDWICH_FILLINGS, FundamentalMood, MoodProfile } from './quizData';

/** Fundamental moods whose fillings make up this result's sandwich. */
export function sandwichMoods(mood: MoodProfile): FundamentalMood[] {
  const keys = Object.keys(BASE_SANDWICH_FILLINGS) as FundamentalMood[];
  const pick = (filling: string) => keys.find((k) => BASE_SANDWICH_FILLINGS[k].nameTh === filling);
  const a = pick(mood.sandwichFilling1) ?? mood.fundamentalMix[0];
  const b = pick(mood.sandwichFilling2) ?? a;
  return a === b ? [a] : [a, b];
}

/** Card background: one bread colour, or two halves for a MIX 2 sandwich. */
export function sandwichBackground(moods: FundamentalMood[]): string {
  const [a, b] = moods.map((m) => BASE_SANDWICH_FILLINGS[m].color);
  return b ? `linear-gradient(115deg, ${a} 0 50%, ${b} 50% 100%)` : a;
}
