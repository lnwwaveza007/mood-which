export type FundamentalMood = 'happy' | 'boring' | 'angry' | 'sad';

export type MoodType =
  | 'happy'
  | 'boring'
  | 'angry'
  | 'sad'
  | 'chill'
  | 'passionate'
  | 'bittersweet'
  | 'frustrated'
  | 'burnout'
  | 'heartbroken'
  | 'stressed'
  | 'playful';

export interface MoodProfile {
  id: MoodType;
  chibiName: string;
  chibiTitle: string;
  chibiPersona: string;
  chibiDescription: string;
  fundamentalMix: FundamentalMood[];
  isFundamental: boolean;
  mixLabelTh: string;
  titleTh: string;
  titleEn: string;
  sandwichName: string;
  tagline: string;
  sandwichPairingTip: string;
  sandwichFilling1: string;
  sandwichFilling2: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  breadType: string;
  fillingDesc: string;
  flavorNotes: string[];
  prophecy: string;
  vibeDescription: string;
  energyLevel: number; // 0 - 100
  comfortLevel: number; // 0 - 100
  intensityLevel: number; // 0 - 100
  bestPairDrink: string;
  emoji: string;
  hashtag: string;
}

export interface QuizOption {
  id: string;
  label: string;
  subLabel?: string;
  emoji: string;
  moodWeights: Partial<Record<FundamentalMood, number>>;
}

export interface QuizQuestion {
  id: number;
  questionNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  options: QuizOption[];
}

export const BASE_SANDWICH_FILLINGS: Record<
  FundamentalMood,
  { labelTh: string; breadTh: string; nameTh: string; desc: string; emoji: string; color: string }
> = {
  happy: {
    labelTh: 'มีความสุข',
    breadTh: 'ขนมปังจี่หอม',
    nameTh: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    desc: 'ขนมปังจี่หอม ไส้หมูหยอง + น้ำสลัด + โบโลน่า หอมกรุ่นจากเตาหน้าร้าน',
    emoji: '☀️',
    color: '#FFE83B',
  },
  boring: {
    labelTh: 'เฉย ๆ',
    breadTh: 'ขนมปังจี่หอม',
    nameTh: 'ไข่คน + ปูอัด + มายองเนส',
    desc: 'ขนมปังจี่หอม ไส้ไข่คน + ปูอัด + มายองเนส หอมกรุ่นจากเตาหน้าร้าน',
    emoji: '😐',
    color: '#7ED957',
  },
  angry: {
    labelTh: 'โกรธ',
    breadTh: 'ขนมปังจี่หอม',
    nameTh: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    desc: 'ขนมปังจี่หอม ไส้ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง หอมกรุ่นจากเตาหน้าร้าน',
    emoji: '🔥',
    color: '#FF8BAE',
  },
  sad: {
    labelTh: 'เศร้า',
    breadTh: 'ขนมปังจี่หอม',
    nameTh: 'ทูน่า + ไข่คน + มายองเนส',
    desc: 'ขนมปังจี่หอม ไส้ทูน่า + ไข่คน + มายองเนส หอมกรุ่นจากเตาหน้าร้าน',
    emoji: '🌧️',
    color: '#8EB2D9',
  },
};

export const MOOD_PROFILES: Record<MoodType, MoodProfile> = {
  // ==========================================
  // 4 FUNDAMENTAL CHIBI CHARACTERS (อารมณ์หลัก)
  // ==========================================
  happy: {
    id: 'happy',
    chibiName: 'น้องซันนี่ (Sunny)',
    chibiTitle: 'หนุ่มผมทองยิ้มแฉ่ง (The Sunny Waver)',
    chibiPersona: 'ร่าเริง พลังบวก โบกมือทักทุกคน ยิ้มจนตาหยี',
    chibiDescription: 'หนุ่มผมทองในชุดนักศึกษา ยกมือโบกทักทายพร้อมรอยยิ้มกว้าง ใครเดินผ่านก็ติดความสดใสไปด้วย',
    fundamentalMix: ['happy'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: สุขสดใส 100%',
    titleTh: 'มีความสุข สดใส',
    titleEn: 'Sunny & Radiant Joy',
    sandwichName: 'แซนด์วิชมีความสุข · หมูหยองโบโลน่า',
    tagline: 'Toasted Bread · Pork Floss, Salad Cream & Bologna',
    sandwichPairingTip: 'แซนด์วิชมีความสุข: ไส้หมูหยองโบโลน่า ☀️ ชิ้นละ 35.- (2 ชิ้น 67.-)',
    sandwichFilling1: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    sandwichFilling2: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    primaryColor: '#FFE83B',
    secondaryColor: '#FFF7C2',
    accentColor: '#8A6D00',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: '#8A6D00',
    breadType: 'ขนมปังจี่หน้าร้านให้หอม เปลี่ยนแค่ไส้ตามอารมณ์',
    fillingDesc: 'ไส้หมูหยอง + น้ำสลัด + โบโลน่า จัดเต็มในขนมปังจี่หอม ๆ ตัดครึ่งชิ้น กินง่าย พกพาสะดวก',
    flavorNotes: ['หมูหยองฟู ๆ', 'น้ำสลัดหวานมัน', 'โบโลน่าแน่น ๆ', 'ขนมปังจี่หอม'],
    prophecy: 'วันนี้พลังงานของคุณเจิดจ้ามาก! รอยยิ้มของคุณทำให้คนรอบข้างใจละลาย ลุยโปรเจกต์ไหนก็ปัง ชาร์จพลังบวกให้โลกได้ทั้งวัน ☀️✨',
    vibeDescription: 'คุณคือแสงแดดยามเช้าที่สดใสและอบอุ่น มีพลังขับเคลื่อนเต็มเปี่ยม พร้อมแจกรอยยิ้มและความสนุกสนานให้ทุกคนที่อยู่ใกล้',
    energyLevel: 98,
    comfortLevel: 92,
    intensityLevel: 75,
    bestPairDrink: 'ยูซุฮันนี่โซดาเย็นซ่า 🍋 หรือ เสาวรสสปาร์คกลิ้ง',
    emoji: '☀️✨',
    hashtag: '#SunnyChibi #แซนด์วิชมีความสุข #แซนด์วิชคิดตามอารมณ์',
  },

  boring: {
    id: 'boring',
    chibiName: 'น้องโบโร่ (Boro)',
    chibiTitle: 'สาวแว่นหน้านิ่ง (The Calm Observer)',
    chibiPersona: 'เรื่อย ๆ นิ่ง ๆ ตาปรือ ไม่ตื่นเต้นแต่ก็ไม่เดือดร้อน',
    chibiDescription: 'สาวผมยาวใส่แว่นกับเสื้อคลุมสีเขียว ยืนนิ่ง ๆ หน้าเฉย ๆ เหมือนกำลังคิดว่า "กินอะไรดีนะ..."',
    fundamentalMix: ['boring'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: เฉย ๆ 100%',
    titleTh: 'เฉย ๆ ชิล ๆ',
    titleEn: 'Boro & The Mundane Chill',
    sandwichName: 'แซนด์วิชเฉย ๆ · ไข่คนปูอัด',
    tagline: 'Toasted Bread · Scrambled Egg, Crab Stick & Mayo',
    sandwichPairingTip: 'แซนด์วิชเฉย ๆ: ไส้ไข่คนปูอัด 😐 ชิ้นละ 35.- (2 ชิ้น 67.-)',
    sandwichFilling1: 'ไข่คน + ปูอัด + มายองเนส',
    sandwichFilling2: 'ไข่คน + ปูอัด + มายองเนส',
    primaryColor: '#7ED957',
    secondaryColor: '#E3F8D6',
    accentColor: '#2F6B12',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    badgeText: '#2F6B12',
    breadType: 'ขนมปังจี่หน้าร้านให้หอม เปลี่ยนแค่ไส้ตามอารมณ์',
    fillingDesc: 'ไส้ไข่คน + ปูอัด + มายองเนส จัดเต็มในขนมปังจี่หอม ๆ ตัดครึ่งชิ้น กินง่าย พกพาสะดวก',
    flavorNotes: ['ไข่คนนุ่มละมุน', 'ปูอัดเคี้ยวเพลิน', 'มายองเนสครีมมี่', 'ง่าย ๆ แต่อร่อย'],
    prophecy: 'ความเบื่อคือสัญญาณเตือนว่าสมองต้องการสิ่งแปลกใหม่! พักจากรูทีนเดิม ๆ สักนิด ลองทำอะไรที่ไม่เคยทำ แล้วคุณจะพบแรงบันดาลใจครั้งใหม่ 🥱🛋️',
    vibeDescription: 'คุณกำลังอยู่ในโหมดจำเจ เซ็งกับเรื่องเดิม ๆ แซนด์วิชชิ้นนี้ออกแบบมาให้มีเท็กซ์เจอร์กรุบกรอบ เพื่อกระตุกประสาทสัมผัสให้ตื่นเต้นขึ้นอีกครั้ง',
    energyLevel: 35,
    comfortLevel: 80,
    intensityLevel: 25,
    bestPairDrink: 'อเมริกาโน่เย็นไม่ใส่น้ำตาล ☕ หรือ น้ำแร่โซดาซ่าติดปลายลิ้น',
    emoji: '🥱🥔',
    hashtag: '#BoroChibi #แซนด์วิชแก้เบื่อ #แซนด์วิชคิดตามอารมณ์',
  },

  angry: {
    id: 'angry',
    chibiName: 'น้องฟิวรี่ (Fury)',
    chibiTitle: 'สาวผมบ็อบกอดอกเคือง (The Grumpy Bob)',
    chibiPersona: 'หัวร้อน คิ้วขมวด กอดอก พร้อมเหวี่ยงใส่ทุกปัญหา',
    chibiDescription: 'สาวผมบ็อบสีน้ำตาล ผูกเสื้อแดงไว้ที่เอว กอดอกหน้างอสุด ๆ แต่ถ้าได้ของเผ็ด ๆ ก็หายเคืองทันที',
    fundamentalMix: ['angry'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: โกรธเดือด 100%',
    titleTh: 'โกรธจัด เดือดปุดๆ',
    titleEn: 'Fury & The Fiery Blast',
    sandwichName: 'แซนด์วิชโกรธ · ไก่ป๊อปซัมยัง',
    tagline: 'Toasted Bread · Popcorn Chicken, Cheese & Samyang Hot Sauce',
    sandwichPairingTip: 'แซนด์วิชโกรธ: ไส้ไก่ป๊อปซัมยัง 🔥 ชิ้นละ 35.- (2 ชิ้น 67.-)',
    sandwichFilling1: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    sandwichFilling2: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    primaryColor: '#FF8BAE',
    secondaryColor: '#FFE1EA',
    accentColor: '#A3214B',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    badgeText: '#A3214B',
    breadType: 'ขนมปังจี่หน้าร้านให้หอม เปลี่ยนแค่ไส้ตามอารมณ์',
    fillingDesc: 'ไส้ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง จัดเต็มในขนมปังจี่หอม ๆ ตัดครึ่งชิ้น กินง่าย พกพาสะดวก',
    flavorNotes: ['เผ็ดซัมยังสะใจ', 'ไก่ป๊อปกรอบ ๆ', 'ชีสยืดเยิ้ม', 'ระบายอารมณ์'],
    prophecy: 'ความโกรธคือพลังงานมหาศาล! เผาผลาญความหงุดหงิดออกไปด้วยความเผ็ดร้อนสะใจ แล้วเปลี่ยนความเดือดให้กลายเป็นพลังแห่งการลุยเป้าหมาย 🔥🥊',
    vibeDescription: 'คุณกำลังเดือดปุด ๆ มีเรื่องให้หงุดหงิดหรือขัดใจ แซนด์วิชรสจัดจ้านชิ้นนี้พร้อมช่วยคุณเผาผลาญความโกรธให้มลายหายไป!',
    energyLevel: 99,
    comfortLevel: 68,
    intensityLevel: 100,
    bestPairDrink: 'โคล่ามะนาวเย็นจัดซ่าสะใจ 🥤 หรือ อเมริกาโน่เย็นดับเบิ้ลช็อต ☕',
    emoji: '😡🔥',
    hashtag: '#FuryChibi #แซนด์วิชดับเดือด #แซนด์วิชคิดตามอารมณ์',
  },

  sad: {
    id: 'sad',
    chibiName: 'น้องกลูมมี่ (Gloomy)',
    chibiTitle: 'หนุ่มแว่นหลับตาซึม (The Quiet Sigh)',
    chibiPersona: 'อ่อนไหว เงียบ ๆ เอามือกุมอก ต้องการความอบอุ่น',
    chibiDescription: 'หนุ่มแว่นผมสีกรมในเสื้อคลุมตัวโคร่ง หลับตาถอนหายใจเบา ๆ ขอแค่แซนด์วิชอุ่น ๆ สักชิ้นมาฮีลใจ',
    fundamentalMix: ['sad'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: เศร้าดิ่ง 100%',
    titleTh: 'เศร้า ดิ่ง เหงา',
    titleEn: 'Gloomy & Gentle Comfort',
    sandwichName: 'แซนด์วิชเศร้า · ทูน่าไข่คน',
    tagline: 'Toasted Bread · Tuna, Scrambled Egg & Mayo',
    sandwichPairingTip: 'แซนด์วิชเศร้า: ไส้ทูน่าไข่คน 🌧️ ชิ้นละ 35.- (2 ชิ้น 67.-)',
    sandwichFilling1: 'ทูน่า + ไข่คน + มายองเนส',
    sandwichFilling2: 'ทูน่า + ไข่คน + มายองเนส',
    primaryColor: '#8EB2D9',
    secondaryColor: '#E2ECF7',
    accentColor: '#28507A',
    badgeBg: 'bg-zinc-200 text-zinc-800 border-zinc-400',
    badgeText: '#28507A',
    breadType: 'ขนมปังจี่หน้าร้านให้หอม เปลี่ยนแค่ไส้ตามอารมณ์',
    fillingDesc: 'ไส้ทูน่า + ไข่คน + มายองเนส จัดเต็มในขนมปังจี่หอม ๆ ตัดครึ่งชิ้น กินง่าย พกพาสะดวก',
    flavorNotes: ['ทูน่าเค็มมัน', 'ไข่คนอุ่น ๆ', 'มายองเนสนุ่มลิ้น', 'ฮีลใจเบา ๆ'],
    prophecy: 'ไม่เป็นไรเลยถ้าวันนี้จะดิ่งหรือเงียบลง การให้เวลาตัวเองได้พักใจคือของขวัญที่ดีที่สุด ปล่อยให้ตัวเองได้หายใจช้า ๆ แล้วพรุ่งนี้ค่อยเริ่มใหม่นะ 🌙🖤',
    vibeDescription: 'คุณกำลังอยู่ในช่วงเวลาที่ต้องการความเงียบสงบและการโอบกอดทางอารมณ์ การอนุญาตให้ตัวเองรู้สึกเศร้าคือจุดเริ่มต้นของการฟื้นฟู',
    energyLevel: 25,
    comfortLevel: 98,
    intensityLevel: 65,
    bestPairDrink: 'ดาร์กช็อกโกแลตร้อนเข้มข้น 🍫 หรือ ชาเอิร์ลเกรย์อุ่น',
    emoji: '😢🌧️',
    hashtag: '#GloomyChibi #แซนด์วิชฮีลใจ #แซนด์วิชคิดตามอารมณ์',
  },

  // ==========================================
  // 8 MIX & MATCH HYBRID CHIBI CHARACTERS
  // ==========================================
  chill: {
    id: 'chill',
    chibiName: 'น้องนูบิ (Nubi)',
    chibiTitle: 'ก้อนเมฆลอยละล่อง (The Floating Cloud)',
    chibiPersona: 'ชิลสุดขีด สบายใจ ยิ้มตาหยี ปล่อยจอยไปตามลม',
    chibiDescription: 'หนุ่มผมทองกับสาวแว่นหน้านิ่งมายืนคู่กัน คนนึงยิ้มแฉ่ง อีกคนชิล ๆ รวมกันเป็นวันสบาย ๆ ไม่รีบร้อน',
    fundamentalMix: ['happy', 'boring'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + เฉย ๆ 😐 (สายชิล)',
    titleTh: 'สบายใจ ชิลๆ ปล่อยจอย',
    titleEn: 'Nubi & The Peaceful Cloud',
    sandwichName: 'MIX 2 อารมณ์: หมูหยองโบโลน่า + ไข่คนปูอัด',
    tagline: 'Mix 2 Moods · Pork Floss, Salad Cream & Bologna + Scrambled Egg, Crab Stick & Mayo',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: หมูหยองโบโลน่า ☀️ + ไข่คนปูอัด 😐 35.-',
    sandwichFilling1: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    sandwichFilling2: 'ไข่คน + ปูอัด + มายองเนส',
    primaryColor: '#0284C7',
    secondaryColor: '#F0F9FF',
    accentColor: '#0369A1',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
    badgeText: '#075985',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้หมูหยอง + น้ำสลัด + โบโลน่า ครึ่งหลังไส้ไข่คน + ปูอัด + มายองเนส ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['หมูหยองฟู ๆ', 'น้ำสลัดหวานมัน', 'ไข่คนนุ่มละมุน', 'ปูอัดเคี้ยวเพลิน'],
    prophecy: 'การปล่อยใจให้ไหลไปตามสบาย ไม่เร่งรีบ ไม่กดดันตัวเอง คือความสุขที่แท้จริง วันนี้ดื่มด่ำกับความสงบให้เต็มที่นะ ☁️🤍',
    vibeDescription: 'การรวมตัวของความสุขและความเรื่อยเปื่อย กลายเป็นความนิ่งสงบ สบายใจ ไม่มีความกดดันใดๆ มาทำลายความชิลของคุณได้',
    energyLevel: 55,
    comfortLevel: 96,
    intensityLevel: 20,
    bestPairDrink: 'นมสดฮอกไกโดเย็นละมุน 🥛 หรือ ชาข้าวบาร์เลย์หอมกรุ่น',
    emoji: '☁️🥪',
    hashtag: '#NubiChibi #แซนด์วิชสายชิล #แซนด์วิชคิดตามอารมณ์',
  },

  passionate: {
    id: 'passionate',
    chibiName: 'น้องอิกนิส (Ignis)',
    chibiTitle: 'สปาร์กไดนาโมบ้าพลัง (The Hyper Dynamo)',
    chibiPersona: 'ไฮป์จัด พลังงานล้น ตาวาว มีสายฟ้าแลบแปลบปลาบ',
    chibiDescription: 'หนุ่มผมทองโบกมือเชียร์ สาวผมบ็อบกอดอกเตรียมลุย พลังบวกผสมไฟในใจ วันนี้พร้อมชนทุกอย่าง',
    fundamentalMix: ['happy', 'angry'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + โกรธ 🔥 (ไฟแรง บ้าพลัง)',
    titleTh: 'ไฟแรง บ้าพลัง ไฮป์จัด',
    titleEn: 'Ignis & The Hyper Dynamo',
    sandwichName: 'MIX 2 อารมณ์: หมูหยองโบโลน่า + ไก่ป๊อปซัมยัง',
    tagline: 'Mix 2 Moods · Pork Floss, Salad Cream & Bologna + Popcorn Chicken, Cheese & Samyang Hot Sauce',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: หมูหยองโบโลน่า ☀️ + ไก่ป๊อปซัมยัง 🔥 35.-',
    sandwichFilling1: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    sandwichFilling2: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    primaryColor: '#EA580C',
    secondaryColor: '#FFF7ED',
    accentColor: '#C2410C',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    badgeText: '#9A3412',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้หมูหยอง + น้ำสลัด + โบโลน่า ครึ่งหลังไส้ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['หมูหยองฟู ๆ', 'น้ำสลัดหวานมัน', 'เผ็ดซัมยังสะใจ', 'ไก่ป๊อปกรอบ ๆ'],
    prophecy: 'เมื่อความสุขผสมเข้ากับความดุดัน ผลลัพธ์คือแพชชั่นที่ไม่มีใครหยุดได้! ลุยให้สุด เหยียบคันเร่งให้มิด แล้วความสำเร็จจะเป็นของคุณ ⚡🚀',
    vibeDescription: 'คุณกำลังไฮป์สุดขีด มีความกระตือรือร้นและพลังขับเคลื่อนสูงลิ่ว พร้อมชนทุกอุปสรรคด้วยรอยยิ้มและความมั่นใจเต็มร้อย',
    energyLevel: 99,
    comfortLevel: 75,
    intensityLevel: 95,
    bestPairDrink: 'โคล่าดับเบิ้ลเอสเพรสโซ่ ☕🥤 หรือ เอนเนอร์จี้ดริ้งค์ไซรัปส้มยูซุ',
    emoji: '⚡🔥',
    hashtag: '#IgnisChibi #แซนด์วิชไฟแรง #แซนด์วิชคิดตามอารมณ์',
  },

  bittersweet: {
    id: 'bittersweet',
    chibiName: 'น้องออร่า (Aura)',
    chibiTitle: 'นักฝันคิดถึงวันวาน (The Nostalgic Dreamer)',
    chibiPersona: 'อบอุ่น ซึ้งใจ ยิ้มทั้งน้ำตาประกายดาว',
    chibiDescription: 'หนุ่มผมทองยิ้มกว้างข้าง ๆ หนุ่มแว่นที่หลับตาซึม สุขปนเศร้าแบบอบอุ่น คิดถึงเรื่องดี ๆ ที่ผ่านมา',
    fundamentalMix: ['happy', 'sad'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + เศร้า 😢 (ซึ้งใจ คิดถึงวันวาน)',
    titleTh: 'ซึ้งใจ คิดถึงวันวาน',
    titleEn: 'Aura & The Bittersweet Memory',
    sandwichName: 'MIX 2 อารมณ์: หมูหยองโบโลน่า + ทูน่าไข่คน',
    tagline: 'Mix 2 Moods · Pork Floss, Salad Cream & Bologna + Tuna, Scrambled Egg & Mayo',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: หมูหยองโบโลน่า ☀️ + ทูน่าไข่คน 🌧️ 35.-',
    sandwichFilling1: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    sandwichFilling2: 'ทูน่า + ไข่คน + มายองเนส',
    primaryColor: '#FB7185',
    secondaryColor: '#FFF1F2',
    accentColor: '#BE123C',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    badgeText: '#9F1239',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้หมูหยอง + น้ำสลัด + โบโลน่า ครึ่งหลังไส้ทูน่า + ไข่คน + มายองเนส ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['หมูหยองฟู ๆ', 'น้ำสลัดหวานมัน', 'ทูน่าเค็มมัน', 'ไข่คนอุ่น ๆ'],
    prophecy: 'ความรู้สึกอบอุ่นปนเศร้าคือเครื่องเตือนใจว่าสิ่งดี ๆ เคยเกิดขึ้นจริง ยิ้มให้กับความทรงจำ แล้วก้าวต่อไปอย่างอ่อนโยนนะ 🍂💌',
    vibeDescription: 'คุณกำลังนึกถึงความทรงจำเก่า ๆ มีทั้งรอยยิ้มและความคิดถึงลอยอยู่ในใจ แซนด์วิชชิ้นนี้จะโอบกอดอดีตและมอบความละมุนให้ปัจจุบัน',
    energyLevel: 60,
    comfortLevel: 95,
    intensityLevel: 50,
    bestPairDrink: 'ชาคาโมมายล์ผสมน้ำผึ้งวานิลลา 🌼 หรือ ชากุหลาบอุ่นนุ่ม',
    emoji: '🍂💌',
    hashtag: '#AuraChibi #แซนด์วิชซึ้งใจ #แซนด์วิชคิดตามอารมณ์',
  },

  frustrated: {
    id: 'frustrated',
    chibiName: 'น้องกรัมบี้ (Grumby)',
    chibiTitle: 'ตัวจิ๋วขี้หงุดหงิด (The Spicy Sceptic)',
    chibiPersona: 'เซ็งเป็ด คิ้วย่น กอดอก พ่นลมหายใจฟู่ๆ',
    chibiDescription: 'สาวแว่นหน้านิ่งยืนข้างสาวผมบ็อบที่กอดอกเคือง เบื่อก็เบื่อ หงุดหงิดก็หงุดหงิด ขอของเผ็ด ๆ มาระบายหน่อย',
    fundamentalMix: ['boring', 'angry'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: เฉย ๆ 😐 + โกรธ 🔥 (หงุดหงิด งุ่นง่าน)',
    titleTh: 'หงุดหงิด งุ่นง่าน เซ็งเป็ด',
    titleEn: 'Grumby & The Restless Spark',
    sandwichName: 'MIX 2 อารมณ์: ไข่คนปูอัด + ไก่ป๊อปซัมยัง',
    tagline: 'Mix 2 Moods · Scrambled Egg, Crab Stick & Mayo + Popcorn Chicken, Cheese & Samyang Hot Sauce',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: ไข่คนปูอัด 😐 + ไก่ป๊อปซัมยัง 🔥 35.-',
    sandwichFilling1: 'ไข่คน + ปูอัด + มายองเนส',
    sandwichFilling2: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    primaryColor: '#D97706',
    secondaryColor: '#FEF3C7',
    accentColor: '#B45309',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: '#92400E',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้ไข่คน + ปูอัด + มายองเนส ครึ่งหลังไส้ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['ไข่คนนุ่มละมุน', 'ปูอัดเคี้ยวเพลิน', 'เผ็ดซัมยังสะใจ', 'ไก่ป๊อปกรอบ ๆ'],
    prophecy: 'เมื่อความน่าเบื่อบวกกับความไม่ได้ดั่งใจ ทำให้ใจร้อนรุ่ม เคี้ยวความหงุดหงิดให้แหลกแล้วถอยออกมามองภาพใหญ่ ทุกอย่างจะคลี่คลาย 😤💥',
    vibeDescription: 'คุณรู้สึกเหมือนติดอยู่ในที่เดิม ๆ และมีเรื่องขัดหูขัดตา แซนด์วิชเนื้อกรุบกรอบพริกไทยดำจะช่วยเคี้ยวระบายความอึดอัดให้หมดไป',
    energyLevel: 82,
    comfortLevel: 65,
    intensityLevel: 88,
    bestPairDrink: 'จิงเจอร์เอลผสมเลมอนสดซ่าจัด 🍋 หรือ ชาเขียวสกัดเย็นเข้มข้น',
    emoji: '😤🥊',
    hashtag: '#GrumbyChibi #แซนด์วิชระบายหงุดหงิด #แซนด์วิชคิดตามอารมณ์',
  },

  burnout: {
    id: 'burnout',
    chibiName: 'น้องสเปราต์ (Sprout)',
    chibiTitle: 'ต้นกล้าหมดพลัง (The Drained Seedling)',
    chibiPersona: 'หมดแรง แบตเตอรี่กระพริบ ต้องการการรดน้ำพักผ่อน',
    chibiDescription: 'สาวแว่นหน้านิ่งกับหนุ่มแว่นหลับตาซึม แบตใกล้หมดทั้งคู่ ขอพักหายใจและเติมพลังด้วยของอร่อยง่าย ๆ',
    fundamentalMix: ['boring', 'sad'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: เฉย ๆ 😐 + เศร้า 😢 (หมดไฟ ไร้พลัง)',
    titleTh: 'หมดไฟ ไร้พลัง เคว้งคว้าง',
    titleEn: 'Sprout & The Restful Recharge',
    sandwichName: 'MIX 2 อารมณ์: ไข่คนปูอัด + ทูน่าไข่คน',
    tagline: 'Mix 2 Moods · Scrambled Egg, Crab Stick & Mayo + Tuna, Scrambled Egg & Mayo',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: ไข่คนปูอัด 😐 + ทูน่าไข่คน 🌧️ 35.-',
    sandwichFilling1: 'ไข่คน + ปูอัด + มายองเนส',
    sandwichFilling2: 'ทูน่า + ไข่คน + มายองเนส',
    primaryColor: '#059669',
    secondaryColor: '#ECFDF5',
    accentColor: '#047857',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badgeText: '#065F46',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้ไข่คน + ปูอัด + มายองเนส ครึ่งหลังไส้ทูน่า + ไข่คน + มายองเนส ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['ไข่คนนุ่มละมุน', 'ปูอัดเคี้ยวเพลิน', 'ทูน่าเค็มมัน', 'ไข่คนอุ่น ๆ'],
    prophecy: 'แบตเตอรี่ของคุณกำลังหมดเกลี้ยง อย่าฝืนวิ่งต่อเลยนะ อนุญาตให้ตัวเองได้นอนพัก วางมือถือ และฟื้นฟูจิตวิญญาณอย่างเต็มที่ 🪫🔋',
    vibeDescription: 'การทำงานหนักผสมความจำเจทำให้คุณรู้สึกเคว้งและไร้พลัง แซนด์วิชซูเปอร์ฟู้ดชิ้นนี้จะช่วยเติมวิตามินและสารอาหารเพื่อรีเซ็ตร่างกาย',
    energyLevel: 15,
    comfortLevel: 94,
    intensityLevel: 40,
    bestPairDrink: 'สมูทตี้อโวคาโดกล้วยหอมโอ๊ตมิลค์ 🥑🍌 หรือ โคโคนัทวอเตอร์สดชื่น',
    emoji: '🪫🌱',
    hashtag: '#SproutChibi #แซนด์วิชรีชาร์จพลัง #แซนด์วิชคิดตามอารมณ์',
  },

  heartbroken: {
    id: 'heartbroken',
    chibiName: 'น้องร็อกซี่ (Roxy)',
    chibiTitle: 'หัวใจติดพลาสเตอร์ (The Broken Velvet)',
    chibiPersona: 'เจ็บแต่สตรอง ติดพลาสเตอร์หัวใจที่แก้ม ดาร์กแต่เท่',
    chibiDescription: 'สาวผมบ็อบกอดอกเคืองกับหนุ่มแว่นเอามือกุมอก โกรธก็โกรธ เสียใจก็เสียใจ วันนี้ขอฮีลใจตัวเองก่อน',
    fundamentalMix: ['angry', 'sad'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: โกรธ 🔥 + เศร้า 😢 (เจ็บช้ำ ปวดใจ)',
    titleTh: 'เจ็บช้ำ ปวดใจ แค้นปนเศร้า',
    titleEn: 'Roxy & The Velvet Heartbreak',
    sandwichName: 'MIX 2 อารมณ์: ไก่ป๊อปซัมยัง + ทูน่าไข่คน',
    tagline: 'Mix 2 Moods · Popcorn Chicken, Cheese & Samyang Hot Sauce + Tuna, Scrambled Egg & Mayo',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: ไก่ป๊อปซัมยัง 🔥 + ทูน่าไข่คน 🌧️ 35.-',
    sandwichFilling1: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    sandwichFilling2: 'ทูน่า + ไข่คน + มายองเนส',
    primaryColor: '#9F1239',
    secondaryColor: '#FFE4E6',
    accentColor: '#4C0519',
    badgeBg: 'bg-rose-200 text-rose-950 border-rose-400',
    badgeText: '#4C0519',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง ครึ่งหลังไส้ทูน่า + ไข่คน + มายองเนส ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['เผ็ดซัมยังสะใจ', 'ไก่ป๊อปกรอบ ๆ', 'ทูน่าเค็มมัน', 'ไข่คนอุ่น ๆ'],
    prophecy: 'ความเจ็บปวดในวันนี้คือบทเรียนที่จะทำให้คุณแข็งแกร่งขึ้นอย่างสง่างาม ปล่อยน้ำตาให้ไหล แล้วกินของอร่อยเพื่อเริ่มต้นชีวิตใหม่ที่ดียิ่งกว่า 💔❤️‍🩹',
    vibeDescription: 'มีความเสียใจผสมความเจ็บแค้นที่ยากจะลืม แซนด์วิชดาร์กโกโก้เนื้อตุ๋นเข้มข้นชิ้นนี้เข้าใจความเจ็บปวดของคุณดีที่สุด',
    energyLevel: 65,
    comfortLevel: 85,
    intensityLevel: 92,
    bestPairDrink: 'ม็อคค่าดาร์กช็อกโกแลตเย็น ☕🍫 หรือ ไวน์แดงไร้แอลกอฮอล์สปาร์คกลิ้ง',
    emoji: '💔❤️‍🩹',
    hashtag: '#RoxyChibi #แซนด์วิชเยียวยาใจ #แซนด์วิชคิดตามอารมณ์',
  },

  stressed: {
    id: 'stressed',
    chibiName: 'น้องซีนิธ (Zenith)',
    chibiTitle: 'ตัวคิดมากสมองหมุน (The Overthinking Mind)',
    chibiPersona: 'สมองวิ่งเร็ว แว่นตากลมโต เกลียวความคิดหมุนติ้วบนหัว',
    chibiDescription: 'สามเพื่อนชิบิรวมตัว ทั้งเคือง ทั้งซึม ทั้งหน้านิ่ง สมองตื้อไปหมด ขอเบรกสั้น ๆ กับแซนด์วิชสักชิ้น',
    fundamentalMix: ['angry', 'sad', 'boring'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: เครียด สมองตึง ว้าวุ่นใจ',
    titleTh: 'เครียด ว้าวุ่น สมองตึง',
    titleEn: 'Zenith & The Overthinking Whirl',
    sandwichName: 'MIX 2 อารมณ์: ไข่คนปูอัด + ทูน่าไข่คน',
    tagline: 'Mix 2 Moods · Scrambled Egg, Crab Stick & Mayo + Tuna, Scrambled Egg & Mayo',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: ไข่คนปูอัด 😐 + ทูน่าไข่คน 🌧️ 35.-',
    sandwichFilling1: 'ไข่คน + ปูอัด + มายองเนส',
    sandwichFilling2: 'ทูน่า + ไข่คน + มายองเนส',
    primaryColor: '#65A30D',
    secondaryColor: '#F7FEE7',
    accentColor: '#3F6212',
    badgeBg: 'bg-lime-100 text-lime-900 border-lime-300',
    badgeText: '#365314',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้ไข่คน + ปูอัด + มายองเนส ครึ่งหลังไส้ทูน่า + ไข่คน + มายองเนส ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['ไข่คนนุ่มละมุน', 'ปูอัดเคี้ยวเพลิน', 'ทูน่าเค็มมัน', 'ไข่คนอุ่น ๆ'],
    prophecy: 'สูดหายใจเข้าลึก ๆ ช้า ๆ นับ 1-2-3 สิ่งที่กำลังแบกไว้หนักเกินไป วางลงก่อนนะ ทุกอย่างมีจังหวะเวลาของมัน ปล่อยวางแล้วดูแลใจตัวเองนะ 🌿💚',
    vibeDescription: 'ความคิดในหัวคุณกำลังวิ่งเร็วและตึงเครียด แซนด์วิชชิ้นนี้จะช่วยดึงคุณกลับมาสู่ความสงบ ผ่อนคลาย และคืนความบาลานซ์ให้ชีวิต',
    energyLevel: 62,
    comfortLevel: 92,
    intensityLevel: 80,
    bestPairDrink: 'มัทฉะลาเต้โอ๊ตมิลค์หวานน้อย 🍵 หรือ ชาคาโมมายล์ผสมน้ำผึ้ง',
    emoji: '🤯🌀',
    hashtag: '#ZenithChibi #แซนด์วิชคลายเครียด #แซนด์วิชคิดตามอารมณ์',
  },

  playful: {
    id: 'playful',
    chibiName: 'น้องมิสชิฟ (Mischief)',
    chibiTitle: 'ปีศาจน้อยแสนซน (The Cheeky Trickster)',
    chibiPersona: 'กวนโอ๊ย แลบลิ้นแกล้ง ซุกซน ซ่า แหวกแนว',
    chibiDescription: 'สามเพื่อนชิบิรวมแก๊ง คนนึงยิ้ม คนนึงเหวี่ยง คนนึงนิ่ง วุ่นวายแต่สนุก พร้อมแกล้งเพื่อนได้ทั้งวัน',
    fundamentalMix: ['happy', 'angry', 'boring'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + ซนกวนโอ๊ย 😜 (หวานเค็มเผ็ดซ่า)',
    titleTh: 'ขี้เล่น กวนๆ ซุกซน',
    titleEn: 'Mischief & The Sassy Spark',
    sandwichName: 'MIX 2 อารมณ์: หมูหยองโบโลน่า + ไก่ป๊อปซัมยัง',
    tagline: 'Mix 2 Moods · Pork Floss, Salad Cream & Bologna + Popcorn Chicken, Cheese & Samyang Hot Sauce',
    sandwichPairingTip: 'MIX 2 อารมณ์ในชิ้นเดียว: หมูหยองโบโลน่า ☀️ + ไก่ป๊อปซัมยัง 🔥 35.-',
    sandwichFilling1: 'หมูหยอง + น้ำสลัด + โบโลน่า',
    sandwichFilling2: 'ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง',
    primaryColor: '#9333EA',
    secondaryColor: '#FAF5FF',
    accentColor: '#6B21A8',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
    badgeText: '#581C87',
    breadType: 'ขนมปังจี่หอมหน้าร้าน ไส้ 2 อารมณ์ในชิ้นเดียว',
    fillingDesc: 'ครึ่งแรกไส้หมูหยอง + น้ำสลัด + โบโลน่า ครึ่งหลังไส้ไก่ป๊อป + ชีส + ซอสเผ็ดซัมยัง ได้ลอง 2 รสชาติในราคาเดียว',
    flavorNotes: ['หมูหยองฟู ๆ', 'น้ำสลัดหวานมัน', 'เผ็ดซัมยังสะใจ', 'ไก่ป๊อปกรอบ ๆ'],
    prophecy: 'ชีวิตมันสั้นเกินกว่าจะจริงจังตลอดเวลา! ปลดปล่อยความกวนและความซนในตัวคุณออกมา สร้างเสียงหัวเราะแล้วทำให้ทุกคนประหลาดใจ 😜🎨',
    vibeDescription: 'คุณกำลังอยู่ในอารมณ์ขี้เล่น ซน กวนประสาทนิด ๆ อยากลองอะไรแหวกแนว แซนด์วิชครัวฟเฟิลหวานเค็มชิ้นนี้ตอบโจทย์ความซ่าได้เป๊ะ!',
    energyLevel: 88,
    comfortLevel: 88,
    intensityLevel: 70,
    bestPairDrink: 'เบอร์รี่สปาร์คกลิ้งป๊อปปิ้งโบบา 🍓🫧 หรือ คาราเมลป๊อปคอร์นปั่น',
    emoji: '😜😈',
    hashtag: '#MischiefChibi #แซนด์วิชสายกวน #แซนด์วิชคิดตามอารมณ์',
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionNumber: '01',
    badge: 'ระดับพลังงานในใจ (Heart Battery)',
    title: 'เช้านี้ตื่นมา ระดับแบตเตอรี่ในใจของคุณอยู่ที่กี่เปอร์เซ็นต์?',
    subtitle: 'วัดระดับพลังชีวิตและความพร้อมลุยในเช้าวันนี้',
    options: [
      {
        id: '1-a',
        label: '🔋 100% ล้นปรี่ สดใสพร้อมแจกรอยยิ้ม!',
        subLabel: 'ตื่นตัวสุดขีด พลังงานเต็มเปี่ยม อารมณ์ดีพร้อมลุยทั้งวัน',
        emoji: '☀️',
        moodWeights: { happy: 3 },
      },
      {
        id: '1-b',
        label: '🔥 75% เครื่องร้อนจี๋ ไฟแรงพร้อมฟาดฟัน!',
        subLabel: 'ใจเต้นแรง มีเรื่องให้หงุดหงิด หรือมีไฟอยากลุยให้เสร็จขาดลอย',
        emoji: '💥',
        moodWeights: { angry: 3 },
      },
      {
        id: '1-c',
        label: '🥱 50% เรื่อย ๆ ชิล ๆ โหมดประหยัดพลังงาน',
        subLabel: 'ปล่อยไหลไปตามวัน ไม่ได้หมดแรงแต่ก็เบื่อ ๆ เซ็ง ๆ',
        emoji: '🛋️',
        moodWeights: { boring: 3 },
      },
      {
        id: '1-d',
        label: '🪫 25% แบตแดง ดิ่ง ๆ อยากนอนพักใจ',
        subLabel: 'เหนื่อยใจ เหงา ๆ เศร้า ๆ อยากอยู่เงียบ ๆ มุดผ้าห่ม',
        emoji: '🌧️',
        moodWeights: { sad: 3 },
      },
    ],
  },
  {
    id: 2,
    questionNumber: '02',
    badge: 'สภาพอากาศในใจ (Heart Weather)',
    title: 'ถ้าส่องเข้าไปในใจตอนนี้ สภาพอากาศข้างในเป็นแบบไหน?',
    subtitle: 'บรรยากาศและอารมณ์ที่กำลังปกคลุมความรู้สึกของคุณอยู่ตอนนี้',
    options: [
      {
        id: '2-a',
        label: '☀️ แดดยามสาย ท้องฟ้าสดใส ไร้เมฆหมอก',
        subLabel: 'ใจเบาสบาย อบอุ่น ยิ้มได้กับทุกอย่างรอบตัว มีความสุขเต็มเปี่ยม',
        emoji: '🌻',
        moodWeights: { happy: 3 },
      },
      {
        id: '2-b',
        label: '⚡ ฟ้าผ่าเปรี้ยงปร้าง ลาวาภูเขาไฟกำลังปะทุเดือด',
        subLabel: 'หัวร้อน หงุดหงิด อารมณ์พร้อมปะทะ ร้อนแรงเกินต้านทาน',
        emoji: '🥊',
        moodWeights: { angry: 3 },
      },
      {
        id: '2-c',
        label: '🌫️ หมอกจาง ๆ ท้องฟ้าสีเทาทึม ๆ ลอยนิ่ง ๆ น่าเบื่อ',
        subLabel: 'ไม่มีอะไรน่าตื่นเต้น นิ่งเรียบ ไร้คลื่นลม เซ็งกับความจำเจ',
        emoji: '🕊️',
        moodWeights: { boring: 3 },
      },
      {
        id: '2-d',
        label: '🌧️ ฝนตกพรำ ๆ ลมเย็นพัดผ่าน บรรยากาศดิ่งสลัว',
        subLabel: 'เหงานิด ๆ เศร้าหน่อย ๆ รู้สึกเปราะบางและคิดถึงความหลัง',
        emoji: '☕',
        moodWeights: { sad: 3 },
      },
    ],
  },
  {
    id: 3,
    questionNumber: '03',
    badge: 'ความต้องการตอนนี้ (Instant Wish)',
    title: 'ถ้ามีเวลาว่าง 2 ชั่วโมงตอนนี้ อยากวาร์ปไปทำอะไรมากที่สุด?',
    subtitle: 'กิจกรรมที่ใจของคุณเรียกร้องและโหยหาในเวลานี้',
    options: [
      {
        id: '3-a',
        label: '🥳 แวะคาเฟ่ เม้าท์มอยกับแก๊งเพื่อน หัวเราะลั่นร้าน',
        subLabel: 'เติมเต็มความสุขด้วยเสียงหัวเราะและมิตรภาพที่สดใส',
        emoji: '🕺',
        moodWeights: { happy: 3 },
      },
      {
        id: '3-b',
        label: '🥊 ไปต่อยมวย ตะโกนร้องคาราโอเกะ หรือสับงานให้แหลก',
        subLabel: 'ปลดปล่อยพลังงานความเดือดและระบายอารมณ์ให้สะใจสุดขีด',
        emoji: '🎯',
        moodWeights: { angry: 3 },
      },
      {
        id: '3-c',
        label: '🛋️ นอนไถฟีดเรื่อยเปื่อย ดูคลิปเพลิน ๆ ฆ่าเวลาในห้อง',
        subLabel: 'ไม่ต้องคิดอะไรเยอะ แค่ปล่อยจอยไปกับเวลาว่างแก้เซ็ง',
        emoji: '📺',
        moodWeights: { boring: 3 },
      },
      {
        id: '3-d',
        label: '🎧 นอนฟังเพลงเศร้าคนเดียวในห้องสลัว กอดหมอนนุ่ม ๆ',
        subLabel: 'ให้เวลาตัวเองได้ปลดปล่อยความรู้สึกและฮีลใจเงียบ ๆ',
        emoji: '🧸',
        moodWeights: { sad: 3 },
      },
    ],
  },
  {
    id: 4,
    questionNumber: '04',
    badge: 'เพลงประจำอารมณ์ (Heart Soundtrack)',
    title: 'ถ้าเปิดเพลงประกอบความรู้สึกตอนนี้ เพลงของคุณจะเป็นแนวไหน?',
    subtitle: 'ทำนองและจังหวะดนตรีที่กำลังบรรเลงอยู่ในใจคุณเวลานี้',
    options: [
      {
        id: '4-a',
        label: '🎶 เพลงป็อปจังหวะสดใส บีทสนุกสนาน ชวนโยกตาม',
        subLabel: 'จังหวะฟีลกู๊ด ฟังแล้วโลกสดใส พลังบวกเต็มเปี่ยม รอยยิ้มมาเต็ม',
        emoji: '🎧',
        moodWeights: { happy: 3 },
      },
      {
        id: '4-b',
        label: '🎸 ร็อคบีทหนัก ๆ กีตาร์ดิบสะใจ หรือฮิปฮอปเดือดดาล',
        subLabel: 'พลังงานพุ่งพล่าน ระบายความอัดอั้น ฟาดฟันทุกจังหวะดนตรี',
        emoji: '🔥',
        moodWeights: { angry: 3 },
      },
      {
        id: '4-c',
        label: '📻 เพลง Lo-fi คอร์ดวนเรื่อยเปื่อย ฟังเพลิน ๆ ปล่อยใจลอย',
        subLabel: 'ทำนองนิ่งเรียบ ไม่หวือหวา เหมาะกับการเหม่อลอยฆ่าเวลา',
        emoji: '☕',
        moodWeights: { boring: 3 },
      },
      {
        id: '4-d',
        label: '🎻 บัลลาดเปียโนช้า ๆ ซึ้ง ๆ เมโลดี้บาดลึกกินใจ',
        subLabel: 'ดำดิ่งกับความเงียบและท่วงทำนองที่โอบกอดความเหงาอย่างอ่อนโยน',
        emoji: '🖤',
        moodWeights: { sad: 3 },
      },
    ],
  },
];

/**
 * Calculates the winning mood among the 12 emotions based on the 4 fundamental scores.
 */
export function calculateMoodResult(answers: Record<number, string>): MoodType {
  const scores: Record<FundamentalMood, number> = {
    happy: 0,
    boring: 0,
    angry: 0,
    sad: 0,
  };

  // 1. Accumulate weights for 4 fundamental emotions
  QUIZ_QUESTIONS.forEach((q) => {
    const selectedOptionId = answers[q.id];
    if (selectedOptionId) {
      const option = q.options.find((opt) => opt.id === selectedOptionId);
      if (option && option.moodWeights) {
        Object.entries(option.moodWeights).forEach(([mood, weight]) => {
          if (weight && mood in scores) {
            scores[mood as FundamentalMood] += weight;
          }
        });
      }
    }
  });

  const h = scores.happy / 3;
  const b = scores.boring / 3;
  const a = scores.angry / 3;
  const s = scores.sad / 3;

  // 1. Pure 4-of-a-kind Fundamentals
  if (h === 4) return 'happy';
  if (b === 4) return 'boring';
  if (a === 4) return 'angry';
  if (s === 4) return 'sad';

  // 2. High Tension / Distress (Angry + Sad + Boring) -> Stressed
  if (
    (a >= 2 && s >= 1 && b >= 1) ||
    (s >= 2 && a >= 1 && b >= 1) ||
    (b >= 2 && a >= 1 && s >= 1)
  ) {
    return 'stressed';
  }

  // 3. Playful / Sassy Spark (Happy + Angry + Boring or Full 4-way mix)
  if (
    (h >= 2 && a >= 1 && b >= 1) ||
    (h === 1 && b === 1 && a === 1 && s === 1)
  ) {
    return 'playful';
  }

  // 4. Pairwise Blends (3-1, 2-2, and other 2-1-1 mixes)
  const sorted = (Object.keys(scores) as FundamentalMood[]).sort(
    (x, y) => scores[y] - scores[x]
  );

  const top1 = sorted[0];
  const top2 = sorted[1];
  const pair = [top1, top2].sort().join('+');

  switch (pair) {
    case 'boring+happy':
      return 'chill'; // Happy + Boring
    case 'angry+happy':
      return 'passionate'; // Happy + Angry
    case 'happy+sad':
      return 'bittersweet'; // Happy + Sad
    case 'angry+boring':
      return 'frustrated'; // Boring + Angry
    case 'boring+sad':
      return 'burnout'; // Boring + Sad
    case 'angry+sad':
      return 'heartbroken'; // Angry + Sad
    default:
      return top1;
  }
}

export const ALL_MOOD_KEYS: MoodType[] = [
  'happy',
  'boring',
  'angry',
  'sad',
  'chill',
  'passionate',
  'bittersweet',
  'frustrated',
  'burnout',
  'heartbroken',
  'stressed',
  'playful',
];
