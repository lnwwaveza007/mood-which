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
  { nameTh: string; desc: string; emoji: string; color: string }
> = {
  happy: {
    nameTh: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    desc: 'แฮมรมควัน สับปะรดย่างคาราเมล เชดด้าชีส และฮันนี่มัสตาร์ดหวานฉ่ำ',
    emoji: '☀️',
    color: '#F59E0B',
  },
  boring: {
    nameTh: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    desc: 'เนยสดแท้ เฟล็กเกลือทะเลมัลดอน และมันฝรั่งแผ่นทอดกรอบเคี้ยวเพลินแก้เซ็ง',
    emoji: '🥱',
    color: '#A89F91',
  },
  angry: {
    nameTh: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    desc: 'หมูตุ๋นซอสบาร์บีคิวรมควัน พริกฮาลาพิโญ่ดอง ชีสเบิร์นไฟ และศรีราชามาโย',
    emoji: '😡',
    color: '#E11D48',
  },
  sad: {
    nameTh: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    desc: 'เห็ดแชมปิญองผัดเนยทรัฟเฟิลหอมกรุ่น เชดด้าชีสอุ่น ๆ และหอมผัดคาราเมล',
    emoji: '😢',
    color: '#475569',
  },
};

export const MOOD_PROFILES: Record<MoodType, MoodProfile> = {
  // ==========================================
  // 4 FUNDAMENTAL CHIBI CHARACTERS (อารมณ์หลัก)
  // ==========================================
  happy: {
    id: 'happy',
    chibiName: 'น้องซันนี่ (Sunny)',
    chibiTitle: 'ภูตน้อยแห่งความสดใส (The Joyful Spark)',
    chibiPersona: 'ร่าเริง พลังบวก ยิ้มหวาน แจกรอยยิ้มให้ทุกคน',
    chibiDescription: 'หนูน้อยหัวสีเหลืองทอง เปล่งประกายแสงแดดอบอุ่น วิ่งเล่นพร้อมส่งมอบพลังงานบวกและเสียงหัวเราะให้คนรอบข้าง',
    fundamentalMix: ['happy'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: สุขสดใส 100%',
    titleTh: 'มีความสุข สดใส',
    titleEn: 'Sunny & Radiant Joy',
    sandwichName: 'ซันไชน์ บริออช ฮันนี่มัสตาร์ดแฮมชีส',
    tagline: 'Sunshine Brioche Honey Mustard Smoked Ham Melt',
    sandwichPairingTip: 'สั่งแบบ Single Flavor: ไส้แฮมชีสฮันนี่มัสตาร์ด x2 ชิ้นเต็ม ๆ คำ ☀️',
    sandwichFilling1: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    sandwichFilling2: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    primaryColor: '#FFD043',
    secondaryColor: '#FFFDF0',
    accentColor: '#D97706',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: '#946200',
    breadType: 'ขนมปังบริออชสีเหลืองทอง หอมเนยฝรั่งเศสฉ่ำ ๆ นุ่มละมุนฟู',
    fillingDesc: 'แฮมรมควันพรีเมียม สับปะรดย่างคาราเมล เชดด้าชีสเยิ้ม และซอสฮันนี่มัสตาร์ดรสหวานอมเปรี้ยว',
    flavorNotes: ['สดชื่นฉ่ำใจ', 'หวานอมเปรี้ยว', 'หอมเนยเน้นๆ', 'ชีสยืดฟิน'],
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
    chibiTitle: 'เจ้าก้อนสลอธชิลแก้เซ็ง (The Mundane Sloth)',
    chibiPersona: 'เรื่อย ๆ ชิล ๆ ตาปรือ นั่งเหม่อหาอะไรเคี้ยวเล่น',
    chibiDescription: 'เจ้าก้อนขนสีครีมเบจ นอนกลิ้งไปมาบนโซฟา ตาปรือน่ารัก กำลังเคี้ยวมันฝรั่งทอดแก้เซ็งอย่างเพลิดเพลิน',
    fundamentalMix: ['boring'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: เบื่อหน่าย 100%',
    titleTh: 'เบื่อหน่าย เซ็งๆ',
    titleEn: 'Boro & The Mundane Chill',
    sandwichName: 'ครัสตี้ ซาวโดวจ์ เนยเค็มมันฝรั่งกรอบ',
    tagline: 'Crunchy Crisp Sourdough & Sea Salt Butter Flakes',
    sandwichPairingTip: 'สั่งแบบ Single Flavor: ไส้เนยเค็มฝรั่งเศสมันฝรั่งกรอบ x2 ชิ้น กรุบกรอบสะใจ 🥱',
    sandwichFilling1: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    sandwichFilling2: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    primaryColor: '#B5A895',
    secondaryColor: '#F7F5F0',
    accentColor: '#786B59',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    badgeText: '#574635',
    breadType: 'ขนมปังซาวโดวจ์ขอบกรอบหนึบ กริลล์เนยเค็มหอมมัน เรียบง่ายไม่หวือหวาแต่น่าค้นหา',
    fillingDesc: 'เนยสดแท้ฝรั่งเศส เฟล็กเกลือทะเลมัลดอน และมันฝรั่งแผ่นทอดกรอบเคี้ยวกร้วมๆ ช่วยแก้เซ็งได้ชะงัด',
    flavorNotes: ['เคี้ยวกรุบกรอบสะใจ', 'หอมมันเค็มกลมกล่อม', 'เนยแท้ละลาย', 'เรียบง่ายแต่หยุดกินไม่ได้'],
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
    chibiTitle: 'ตัวจิ๋วไฟลุกพร้อมลุย (The Fiery Fighter)',
    chibiPersona: 'หัวร้อน ดุดัน คิ้วขมวดไฟลุก พร้อมชนทุกปัญหา',
    chibiDescription: 'จิ๋วตัวสีแดงเพลิง มีควันปุ๋ง ๆ บนหัว แก้มป่องคิ้วชนกันอย่างมุ่งมั่น พร้อมระบายความเดือดให้กลายเป็นพลังแห่งชัยชนะ',
    fundamentalMix: ['angry'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: โกรธเดือด 100%',
    titleTh: 'โกรธจัด เดือดปุดๆ',
    titleEn: 'Fury & The Fiery Blast',
    sandwichName: 'ไฟเยอร์ บีทรูท สไปซี่ พูลพอร์ค ฮาลาพิโญ่',
    tagline: 'Fire Beetroot Spicy Pulled Pork Jalapeño Melt',
    sandwichPairingTip: 'สั่งแบบ Single Flavor: ไส้พูลพอร์คเผ็ดเดือดบาร์บีคิว x2 ชิ้น ดับเดือดสะใจ 🔥',
    sandwichFilling1: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    sandwichFilling2: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    primaryColor: '#E11D48',
    secondaryColor: '#FFF1F2',
    accentColor: '#9F1239',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    badgeText: '#88131D',
    breadType: 'ขนมปังบีทรูทสีแดงเพลิง อบกรอบนอกนุ่มใน สีสันสะกดทุกสายตา',
    fillingDesc: 'พูลพอร์คตุ๋นซอสบาร์บีคิวรมควัน พริกฮาลาพิโญ่ดอง มอสซาเรลล่าชีสเบิร์นไฟ และซอสศรีราชามาโยรสเผ็ดจัดจ้านระเบิดพลัง',
    flavorNotes: ['เผ็ดแซ่บสะใจ', 'ระบายอารมณ์สุดฟิน', 'ชีสเยิ้มไฟลุก', 'รมควันเข้มข้นสะใจ'],
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
    chibiTitle: 'หยดน้ำตาโอบกอดใจ (The Melancholy Hug)',
    chibiPersona: 'อ่อนไหว เงียบสงบ กอดผ้าห่ม ต้องการความอบอุ่น',
    chibiDescription: 'น้องน้อยตัวสีชาร์โคล ตากลมโตเป็นประกายหยดน้ำตา กอดหมอนนุ่มนิ่ม รอคอยการโอบกอดและกลิ่นหอมอบอุ่นช่วยฮีลใจ',
    fundamentalMix: ['sad'],
    isFundamental: true,
    mixLabelTh: 'อารมณ์หลัก: เศร้าดิ่ง 100%',
    titleTh: 'เศร้า ดิ่ง เหงา',
    titleEn: 'Gloomy & Gentle Comfort',
    sandwichName: 'มิดไนท์ ชาร์โคล ทรัฟเฟิล มัชรูม เมลท์',
    tagline: 'Midnight Charcoal Truffle Comfort Melt',
    sandwichPairingTip: 'สั่งแบบ Single Flavor: ไส้ทรัฟเฟิลมัชรูมชีส x2 ชิ้น อบอุ่นหัวใจ 🌙',
    sandwichFilling1: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    sandwichFilling2: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    primaryColor: '#475569',
    secondaryColor: '#F8FAFC',
    accentColor: '#1E293B',
    badgeBg: 'bg-zinc-200 text-zinc-800 border-zinc-400',
    badgeText: '#27272A',
    breadType: 'ขนมปังชาร์โคลดำสนิท นุ่มลึก กริลล์เนยช้า ๆ สัมผัสอบอุ่น',
    fillingDesc: 'เห็ดแชมปิญองผัดเนยทรัฟเฟิลหอมกรุ่น เชดด้าชีสอบอุ่น และหัวหอมผัดคาราเมลเนียนนุ่ม โอบกอดหัวใจที่อ่อนล้า',
    flavorNotes: ['หอมทรัฟเฟิลละมุน', 'กลมกล่อมอุ่นใจ', 'ชีสเยิ้มโอบกอด', 'ครีมมี่เข้มข้นฮีลใจ'],
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
    chibiDescription: 'น้องก้อนเมฆสีฟ้าพาสเทล ยิ้มตาหยี นั่งลอยบนปุยเมฆนุ่มนิ่ม ผสมผสานความสุขและความเรื่อยเปื่อยอย่างลงตัว',
    fundamentalMix: ['happy', 'boring'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + เบื่อ 🥱 (สายชิล)',
    titleTh: 'สบายใจ ชิลๆ ปล่อยจอย',
    titleEn: 'Nubi & The Peaceful Cloud',
    sandwichName: 'ดูโอ้แซนด์วิช: ซันไชน์แฮมชีส + เนยเค็มมันฝรั่งกรอบ',
    tagline: 'Duo Mix: Sunshine Ham & Cheese + Crunchy Sea Salt Butter',
    sandwichPairingTip: 'สั่งจับคู่ Mix & Match: ชิ้นที่ 1 ไส้แฮมชีส ☀️ + ชิ้นที่ 2 ไส้เนยเค็มมันฝรั่ง 🥱',
    sandwichFilling1: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    sandwichFilling2: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    primaryColor: '#0284C7',
    secondaryColor: '#F0F9FF',
    accentColor: '#0369A1',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
    badgeText: '#075985',
    breadType: 'ขนมปังโชกุปังขาวฟู นุ่มเด้งเหมือนก้อนเมฆ ตัดขอบเรียบง่าย',
    fillingDesc: 'การผสมผสานระหว่างความหวานฉ่ำของแฮมชีสฮันนี่มัสตาร์ด และความกรุบกรอบของเนยเค็มมันฝรั่งทอด กินเพลินสบายใจ',
    flavorNotes: ['นุ่มละลายในปาก', 'ครีมมี่กลมกล่อม', 'หอมละมุนสบายใจ', 'กินเพลินไม่เลี่ยน'],
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
    chibiDescription: 'น้องส้มลายเสือ ติดหูฟังสุดเท่ กระโดดโลดเต้นด้วยความมันส์สะใจ รวมความสุขและความดุดันเป็นพลังขับเคลื่อนสุดแรง',
    fundamentalMix: ['happy', 'angry'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + โกรธ 🔥 (ไฟแรง บ้าพลัง)',
    titleTh: 'ไฟแรง บ้าพลัง ไฮป์จัด',
    titleEn: 'Ignis & The Hyper Dynamo',
    sandwichName: 'ดูโอ้แซนด์วิช: ซันไชน์แฮมชีส + สไปซี่พูลพอร์ค',
    tagline: 'Duo Mix: Sunshine Honey Mustard + Spicy Fire BBQ Pork',
    sandwichPairingTip: 'สั่งจับคู่ Mix & Match: ชิ้นที่ 1 ไส้แฮมชีส ☀️ + ชิ้นที่ 2 ไส้สไปซี่พูลพอร์ค 🔥',
    sandwichFilling1: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    sandwichFilling2: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    primaryColor: '#EA580C',
    secondaryColor: '#FFF7ED',
    accentColor: '#C2410C',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    badgeText: '#9A3412',
    breadType: 'ขนมปังไทเกอร์เบรดลายเสือ กรอบกรุบผิวนอก นุ่มฉ่ำด้านใน',
    fillingDesc: 'ประกบคู่ความหวานฉ่ำของฮันนี่มัสตาร์ดเข้ากับความเผ็ดร้อนสะใจของพูลพอร์คบาร์บีคิว ระเบิดรสชาติสุดมันส์',
    flavorNotes: ['กรอบสะใจเคี้ยวมันส์', 'เผ็ดหวานลงตัว', 'เบคอนหอมกรุ่น', 'ชีสเยิ้มเย้ายวน'],
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
    chibiDescription: 'น้องน้อยสีชมพูพาสเทล มีใบไม้ร่วงประดับบนศีรษะ ยิ้มหวานพร้อมแววตาซึ้งใจ คิดถึงความทรงจำแสนอบอุ่นในอดีต',
    fundamentalMix: ['happy', 'sad'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + เศร้า 😢 (ซึ้งใจ คิดถึงวันวาน)',
    titleTh: 'ซึ้งใจ คิดถึงวันวาน',
    titleEn: 'Aura & The Bittersweet Memory',
    sandwichName: 'ดูโอ้แซนด์วิช: ซันไชน์แฮมชีส + ทรัฟเฟิลมัชรูมเมลท์',
    tagline: 'Duo Mix: Sunshine Ham & Cheese + Truffle Mushroom Comfort',
    sandwichPairingTip: 'สั่งจับคู่ Mix & Match: ชิ้นที่ 1 ไส้แฮมชีส ☀️ + ชิ้นที่ 2 ไส้ทรัฟเฟิลมัชรูม 😢',
    sandwichFilling1: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    sandwichFilling2: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    primaryColor: '#FB7185',
    secondaryColor: '#FFF1F2',
    accentColor: '#BE123C',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    badgeText: '#9F1239',
    breadType: 'ขนมปังไรย์รัสติกกลิ่นอายคลาสสิก นุ่มแน่นหนึบ หอมกลิ่นธัญพืชคั่ว',
    fillingDesc: 'รสชาติหวานอมเปรี้ยวสดใสจากแฮมฮันนี่มัสตาร์ด ตัดกับกลิ่นหอมลึกซึ้งของทรัฟเฟิลและชีสอุ่น ๆ ให้ความอบอุ่นหัวใจอย่างที่สุด',
    flavorNotes: ['นุ่มละมุนซึ้งใจ', 'เค็มละมุนหอมควัน', 'ชีสทรัฟเฟิลสดชื่น', 'กลมกล่อมคิดถึงวันวาน'],
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
    chibiDescription: 'น้องมัสตาร์ดส้ม ยืนกอดอกทำหน้าย่น พ่นลมหายใจฟู่ ๆ ต้องการของกรุบกรอบรสจัดจ้านมาให้เคี้ยวระบายความอึดอัด',
    fundamentalMix: ['boring', 'angry'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: เบื่อ 🥱 + โกรธ 🔥 (หงุดหงิด งุ่นง่าน)',
    titleTh: 'หงุดหงิด งุ่นง่าน เซ็งเป็ด',
    titleEn: 'Grumby & The Restless Spark',
    sandwichName: 'ดูโอ้แซนด์วิช: เนยเค็มมันฝรั่งกรอบ + สไปซี่พูลพอร์ค',
    tagline: 'Duo Mix: Crunchy Sea Salt Butter + Spicy BBQ Pork',
    sandwichPairingTip: 'สั่งจับคู่ Mix & Match: ชิ้นที่ 1 ไส้เนยเค็มมันฝรั่ง 🥱 + ชิ้นที่ 2 ไส้สไปซี่พูลพอร์ค 🔥',
    sandwichFilling1: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    sandwichFilling2: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    primaryColor: '#D97706',
    secondaryColor: '#FEF3C7',
    accentColor: '#B45309',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: '#92400E',
    breadType: 'ขนมปังเซียบัตต้าเปลือกกรอบจัด เคี้ยวสู้ฟันสะใจ ระบายความอัดอั้น',
    fillingDesc: 'ความมันกรอบของมันฝรั่งทอดผสานความเผ็ดจัดจ้านของพูลพอร์คบาร์บีคิว เคี้ยวกร้วมระบายความหงุดหงิดสะใจ',
    flavorNotes: ['เคี้ยวสู้ฟันสะใจ', 'พริกไทยดำเผ็ดร้อน', 'หอมเจียวกรอบกรุบ', 'เข้มข้นระบายอารมณ์'],
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
    chibiDescription: 'น้องต้นอ่อนสีเขียวเซจ ใบไม้บนหัวลู่ลงเล็กน้อย นั่งกอดเข่า มีสัญลักษณ์แบตเตอรี่สีแดงกระพริบ ต้องการการฟื้นฟู',
    fundamentalMix: ['boring', 'sad'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: เบื่อ 🥱 + เศร้า 😢 (หมดไฟ ไร้พลัง)',
    titleTh: 'หมดไฟ ไร้พลัง เคว้งคว้าง',
    titleEn: 'Sprout & The Restful Recharge',
    sandwichName: 'ดูโอ้แซนด์วิช: เนยเค็มมันฝรั่งกรอบ + ทรัฟเฟิลมัชรูมเมลท์',
    tagline: 'Duo Mix: Crunchy Salt Butter + Truffle Mushroom Comfort',
    sandwichPairingTip: 'สั่งจับคู่ Mix & Match: ชิ้นที่ 1 ไส้เนยเค็มมันฝรั่ง 🥱 + ชิ้นที่ 2 ไส้ทรัฟเฟิลมัชรูม 😢',
    sandwichFilling1: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    sandwichFilling2: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    primaryColor: '#059669',
    secondaryColor: '#ECFDF5',
    accentColor: '#047857',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badgeText: '#065F46',
    breadType: 'ขนมปังมัลติเกรนผสมธัญพืช 9 ชนิด อัดแน่นด้วยกากใย สารอาหาร และวิตามินบี',
    fillingDesc: 'การจับคู่ของเนยเค็มละมุนและเห็ดทรัฟเฟิลชีสอบอุ่น สัมผัสนุ่มเคี้ยวง่าย เติมพลังงานสบายท้องโดยไม่ต้องเปลืองแรงเคี้ยว',
    flavorNotes: ['ย่อยง่ายสบายท้อง', 'สารอาหารครบครัน', 'สดชื่นไม่เหนื่อยเคี้ยว', 'รีชาร์จพลังชีวิต'],
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
    chibiDescription: 'น้องตัวสีม่วงพลัม-ไวน์แดง มีพลาสเตอร์รูปหัวใจแปะที่แก้ม แววตามุ่งมั่นซ่อนความเปราะบาง กอดแซนด์วิชดาร์กช็อกบาร์บีคิวสุดเข้ม',
    fundamentalMix: ['angry', 'sad'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: โกรธ 🔥 + เศร้า 😢 (เจ็บช้ำ ปวดใจ)',
    titleTh: 'เจ็บช้ำ ปวดใจ แค้นปนเศร้า',
    titleEn: 'Roxy & The Velvet Heartbreak',
    sandwichName: 'ดูโอ้แซนด์วิช: สไปซี่พูลพอร์ค + ทรัฟเฟิลมัชรูมเมลท์',
    tagline: 'Duo Mix: Spicy Fire BBQ Pork + Truffle Mushroom Melt',
    sandwichPairingTip: 'สั่งจับคู่ Mix & Match: ชิ้นที่ 1 ไส้สไปซี่พูลพอร์ค 🔥 + ชิ้นที่ 2 ไส้ทรัฟเฟิลมัชรูม 😢',
    sandwichFilling1: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    sandwichFilling2: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    primaryColor: '#9F1239',
    secondaryColor: '#FFE4E6',
    accentColor: '#4C0519',
    badgeBg: 'bg-rose-200 text-rose-950 border-rose-400',
    badgeText: '#4C0519',
    breadType: 'ขนมปังโกโก้ชาร์โคลโทสต์ เข้มข้นลึกซึ้ง หอมกรุ่นกลิ่นดาร์กช็อกโกแลต',
    fillingDesc: 'การปะทะกันของความเผ็ดร้อนสะใจแบบบาร์บีคิว และความครีมมี่นุ่มลึกของเห็ดทรัฟเฟิลชีส เยียวยาทุกรอยแผลใจให้เข้มแข็ง',
    flavorNotes: ['เข้มข้นดาร์กช็อกโกแลต', 'เผ็ดร้อนบาดลึก', 'เนื้อตุ๋นนุ่มละลาย', 'เยียวยาแผลใจ'],
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
    chibiDescription: 'น้องมัทฉะหัวฟู ใส่แว่นตากลมโต มีไอคอนเกลียวความคิดหมุนติ้ว ๆ น่าเอ็นดู ต้องการการผ่อนคลายและปรับคลื่นสมองสู่ความสงบ',
    fundamentalMix: ['angry', 'sad', 'boring'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: เครียด สมองตึง ว้าวุ่นใจ',
    titleTh: 'เครียด ว้าวุ่น สมองตึง',
    titleEn: 'Zenith & The Overthinking Whirl',
    sandwichName: 'ดูโอ้แซนด์วิช: เนยเค็มมันฝรั่งกรอบ + ทรัฟเฟิลมัชรูม (คู่ชาเขียว)',
    tagline: 'Stress-Relief Combo: Crunchy Butter + Truffle Mushroom Melt',
    sandwichPairingTip: 'สั่งจับคู่คลายเครียด: ไส้เนยเค็มมันฝรั่งกรอบ 🥱 + ไส้ทรัฟเฟิลมัชรูม 😢 (พร้อมชาเขียวมัทฉะ)',
    sandwichFilling1: 'ไส้เนยเค็มฝรั่งเศส มันฝรั่งทอดกรอบ',
    sandwichFilling2: 'ไส้ทรัฟเฟิลมัชรูม ครีมมี่ชีสเมลท์',
    primaryColor: '#65A30D',
    secondaryColor: '#F7FEE7',
    accentColor: '#3F6212',
    badgeBg: 'bg-lime-100 text-lime-900 border-lime-300',
    badgeText: '#365314',
    breadType: 'ขนมปังโฮลวีทผสมผงมัทฉะแท้และเมล็ดแฟลกซ์ ช่วยต้านอนุมูลอิสระและปรับคลื่นสมอง',
    fillingDesc: 'การเคี้ยวมันฝรั่งกรอบระบายความตึงเครียด ควบคู่กับความอบอุ่นละมุนของชีสทรัฟเฟิล ช่วยคลายเกลียวความคิดในสมองให้โล่งสบาย',
    flavorNotes: ['เคี้ยวกรุบคลายเครียด', 'เบาสบายท้อง', 'คลีนนุ่มละมุน', 'กลิ่นมัทฉะสงบใจ'],
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
    chibiDescription: 'น้องม่วงนีออน แลบลิ้นแกล้ง มีเขาน้อยน่ารัก ดุ๊กดิ๊กไปมา ชอบทำอะไรหลุดกรอบและสนุกสนานกับความเซอร์ไพรส์',
    fundamentalMix: ['happy', 'angry', 'boring'],
    isFundamental: false,
    mixLabelTh: 'คู่ผสม: สุข ☀️ + ซนกวนโอ๊ย 😜 (หวานเค็มเผ็ดซ่า)',
    titleTh: 'ขี้เล่น กวนๆ ซุกซน',
    titleEn: 'Mischief & The Sassy Spark',
    sandwichName: 'ดูโอ้แซนด์วิช: ซันไชน์แฮมชีส + สไปซี่พูลพอร์ค (ทวิสต์คาราเมล)',
    tagline: 'Sassy Twist: Honey Mustard Ham + Spicy BBQ Pulled Pork',
    sandwichPairingTip: 'สั่งจับคู่ความซ่า: ไส้แฮมชีสฮันนี่มัสตาร์ด ☀️ + ไส้สไปซี่พูลพอร์ค 🔥',
    sandwichFilling1: 'ไส้ซันไชน์ แฮมชีสฮันนี่มัสตาร์ด',
    sandwichFilling2: 'ไส้สไปซี่พูลพอร์ค ฮาลาพิโญ่บาร์บีคิว',
    primaryColor: '#9333EA',
    secondaryColor: '#FAF5FF',
    accentColor: '#6B21A8',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
    badgeText: '#581C87',
    breadType: 'ครัวฟเฟิล (Croffle) อบกรอบนอกนุ่มใน หอมเนยคาราเมลฉ่ำ ทรงเกลียวเก๋ไก๋',
    fillingDesc: 'การรวมตัวสุดแสบของแฮมชีสหวานอมเปรี้ยวและพูลพอร์คบาร์บีคิวเผ็ดซี้ด รสชาติเค็มหวานซ่อนเผ็ด กวนโอ๊ยสะใจ',
    flavorNotes: ['กรอบนอกฉ่ำเนย', 'หวานเค็มตัดเปรี้ยว', 'หอมซินนามอน', 'สนุกทุกคำที่กัด'],
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
