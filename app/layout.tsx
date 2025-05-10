import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Young Webmaster Camp 20",
  description: "YWC20 เปิดรับสมัครแล้ว วันนี้ถึง 30 เมษายน 2025 สมัครเลย ค่ายที่สร้างมืออาชีพให้กับหลายวงการมานานกว่า 20 ปี",
  icons: {
    icon: "https://ywc20.ywc.in.th/favicon.ico",
    shortcut: "https://ywc20.ywc.in.th/favicon.ico",
    apple: "https://ywc20.ywc.in.th/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-black`}
      >
        <nav className="bg-black fixed w-full z-40">
          <div className="flex items-center justify-between xl:container mx-auto transition-all px-8 py-4">
            <Link href="/">
              <Image src="https://ywc20.ywc.in.th/logo-ywc20-mono.png" alt="ywc main logo" className="mt-4 mb-4" height={32} width={64} />
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
