"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

export default function InspectPage({ params }) {
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = params;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        const response = await fetch('https://api.ywc20.ywc.in.th/homework/candidates', {
          headers: {
            'x-reference-id': 'PG12'
          }
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        const allCandidates = [
          { group: data.design, majorName: 'Web Design' },
          { group: data.content, majorName: 'Web Content' },
          { group: data.programming, majorName: 'Web Programming' },
          { group: data.marketing, majorName: 'Web Marketing' }
        ].flatMap(({ group, majorName }) =>
          group.map(c => ({ ...c, majorGroup: majorName }))
        );

        const target = allCandidates.find(c => c.interviewRefNo === id);

        if (target) {
          setCandidate(target);
        } else {
          setError('ไม่พบข้อมูลผู้ผ่านการคัดเลือก');
        }
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="w-10 h-10 border-3 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
      );
    }

    if (error) {
      return <div className="flex flex-col items-center justify-center h-screen bg-black text-white">{error}</div>;
    }

    if (!candidate) {
      return <div className="flex flex-col items-center justify-center h-screen bg-black text-white">ไม่พบข้อมูล</div>;
    }

    return (
      <div className="css-b0rywt">
        <div className="flex flex-col items-center justify-center text-white text-center">
          <Image
            src="https://ywc20.ywc.in.th/ywc20-logo-main.webp"
            alt="YWC 20"
            width={250}
            height={250}
            priority
          />
          <h2 className="text-2xl font-bold mb-4 mt-10">
            ขอแสดงความยินดีกับ
            <br />
            คุณ {candidate.firstName} {candidate.lastName}
          </h2>
          <h2>เลขประจำตัวผู้เข้าสัมภาษณ์: {candidate.interviewRefNo}</h2>
          <h1 className="text-2xl font-bold mt-4">
            ผ่านการคัดเลือก สาขา {candidate.majorGroup} 🎉
            <br />
            Young Webmaster Camp 20
          </h1>
          <Link href="/announcement">
            <button className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer mt-4 ant-btn mx-auto duration-200">
              ย้อนกลับ
            </button>
          </Link>
        </div>
      </div>
    );
  }, [loading, error, candidate]);

  return (
    <div className="css-dbswkg">
      {renderContent}
    </div>
  );
}
