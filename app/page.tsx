import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen main-wrap bg-gradient px-4">
      <Image
        src="https://ywc20.ywc.in.th/ywc20-logo-main.webp"
        alt="YWC 20"
        width={500}
        height={500}
        priority
        className="animate-fade-in"
      />
      <Link href="/announcement" className="mt-30 rounded-lg">
        <button
          className="cursor-pointer bg-y20-gradient px-5 py-3 rounded-lg flex gap-2 hover:opacity-90 text-white font-semibold duration-200"
          aria-label="ดูประกาศผลผู้ผ่านการคัดเลือก"
        >
          <span className="text-xs sm:text-sm">ประกาศผลผู้ผ่านการคัดเลือก</span>
        </button>
      </Link>
    </main>
  );
}
