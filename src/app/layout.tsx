import type { Metadata, Viewport } from "next";
import { Abril_Fatface, Chonburi, Kanit, Poppins } from "next/font/google";
import "./globals.css";

// Display headline — fat-face serif for "MOOD WHICH"
const abrilFatface = Abril_Fatface({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-abril",
  display: "swap",
});

// Tape labels — looped Thai display serif from the poster
const chonburi = Chonburi({
  weight: ["400"],
  subsets: ["thai", "latin"],
  variable: "--font-chonburi",
  display: "swap",
});

// Thai body, prices and numbers
const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap",
});

// Small English labels — "SECTION 8 GROUP 8"
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B46AE",
};

export const metadata: Metadata = {
  title: "Mood W(h)ich • แซนด์วิชคิดตามอารมณ์",
  description:
    "ค้นหาแซนด์วิชตามอารมณ์ประจำวันผ่านคำถามสั้น ๆ 4 ข้อ พร้อมรับคำทำนายและ Story Card ขนาด 9:16 สุดคิ้วท์สำหรับแชร์ลง IG และ TikTok",
  keywords: [
    "แซนด์วิชคิดตามอารมณ์",
    "Mood W(h)ich",
    "แบบทดสอบทายใจ",
    "Quiz",
    "IG Story Quiz",
    "คำทำนายประจำวัน",
  ],
  openGraph: {
    title: "Mood W(h)ich • แซนด์วิชคิดตามอารมณ์",
    description:
      "วันนี้คุณรู้สึกแบบไหน? ค้นหาแซนด์วิชตามอารมณ์ของคุณ พร้อมคำทำนายและการ์ดแชร์ลง Instagram Story",
    siteName: "Mood W(h)ich",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mood W(h)ich • แซนด์วิชคิดตามอารมณ์",
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
      className={`${abrilFatface.variable} ${chonburi.variable} ${kanit.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="poster-bg min-h-full flex flex-col text-white selection:bg-yellow selection:text-ink">
        {children}
      </body>
    </html>
  );
}
