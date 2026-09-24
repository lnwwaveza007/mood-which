import type { Metadata, Viewport } from "next";
import { Abril_Fatface, Kanit, Poppins, Anuphan } from "next/font/google";
import "./globals.css";

// Display headline — fat-face serif for "MOOD-WICH"
const abrilFatface = Abril_Fatface({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-abril",
  display: "swap",
});

// Price / numeric — extra-bold rounded grotesque
const kanit = Kanit({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap",
});

// English labels — geometric sans
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// Thai body — clean rounded Thai sans
const anuphan = Anuphan({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1F41A8",
};

export const metadata: Metadata = {
  title: "แซนด์วิชคิดตามอารมณ์ • Mood Sandwiches Quiz",
  description:
    "ค้นหาแซนด์วิชตามอารมณ์ประจำวันผ่านคำถามสั้น ๆ 4 ข้อ พร้อมรับคำทำนายและ Story Card ขนาด 9:16 สุดคิ้วท์สำหรับแชร์ลง IG และ TikTok",
  keywords: [
    "แซนด์วิชคิดตามอารมณ์",
    "Mood Sandwiches",
    "แบบทดสอบทายใจ",
    "Quiz",
    "IG Story Quiz",
    "คำทำนายประจำวัน",
  ],
  openGraph: {
    title: "แซนด์วิชคิดตามอารมณ์ • Mood Sandwiches Quiz",
    description:
      "วันนี้คุณรู้สึกแบบไหน? ค้นหาแซนด์วิชตามอารมณ์ของคุณ พร้อมคำทำนายและการ์ดแชร์ลง Instagram Story",
    siteName: "แซนด์วิชคิดตามอารมณ์",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "แซนด์วิชคิดตามอารมณ์ • Mood Sandwiches Quiz",
    description: "ค้นหาแซนด์วิชตามอารมณ์ประจำวัน พร้อมแชร์การ์ดลง IG Story",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${abrilFatface.variable} ${kanit.variable} ${poppins.variable} ${anuphan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1F41A8] text-white selection:bg-[#FFE94D] selection:text-[#0D0D0D]">
        {children}
      </body>
    </html>
  );
}
