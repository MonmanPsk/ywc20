"use client"

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ListIcon, GridIcon, DropdownIcon } from '@/components/icons';
import { Candidate, ApiResponse } from '@/domain/entities/Candidate';

export default function Announcement() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);
  const [animateView, setAnimateView] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Fetch candidate data
  useEffect(() => {
    let isMounted = true;

    const fetchCandidates = async () => {
      try {
        const response = await fetch('https://api.ywc20.ywc.in.th/homework/candidates', {
          headers: {
            'x-reference-id': 'PG12'
          }
        });

        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (!isMounted) return;

        const allCandidates: Candidate[] = [
          ...data.design.map(c => ({ ...c, majorGroup: 'design' })),
          ...data.content.map(c => ({ ...c, majorGroup: 'content' })),
          ...data.programming.map(c => ({ ...c, majorGroup: 'programming' })),
          ...data.marketing.map(c => ({ ...c, majorGroup: 'marketing' }))
        ];

        setCandidates(allCandidates);
        setIsLoading(false);

        setTimeout(() => {
          if (isMounted) {
            setAnimateView(true);
          }
        }, 50);
      } catch (err) {
        if (isMounted) {
          setError('ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้งในภายหลัง');
          setIsLoading(false);
          console.error('Error fetching data:', err);
        }
      }
    };

    fetchCandidates();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle dropdown height
  useEffect(() => {
    if (!contentRef.current) return;

    if (isDropdownOpen) {
      setDropdownHeight(contentRef.current.scrollHeight);
    } else {
      setDropdownHeight(0);
    }
  }, [isDropdownOpen]);

  // Handle dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset animation
  const resetAnimation = useCallback(() => {
    setAnimateView(false);
    const timer = setTimeout(() => {
      setAnimateView(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    resetAnimation();
  }, [selectedMajor, viewMode, resetAnimation]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    if (!candidates.length) return [];

    let filtered = [...candidates];

    // Filter by search query
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);

      if (searchTerms.length) {
        filtered = filtered.filter(candidate =>
          searchTerms.every(term =>
            candidate.firstName.toLowerCase().includes(term) ||
            candidate.lastName.toLowerCase().includes(term) ||
            candidate.interviewRefNo.toLowerCase().includes(term) ||
            candidate.majorGroup.toLowerCase().includes(term)
          )
        );
      }
    }

    // Filter by major
    if (selectedMajor !== 'all') {
      filtered = filtered.filter(candidate => candidate.majorGroup === selectedMajor);
    }

    return filtered;
  }, [searchQuery, selectedMajor, candidates]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleMajorChange = useCallback((major: string) => {
    setSelectedMajor(major);
    setIsDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'card' : 'list');
  }, []);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        <div className="text-2xl">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer bg-y20-gradient text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 duration-200"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  const renderMajorName = (major: string) => {
    switch (major) {
      case 'web_design': return 'Design';
      case 'web_content': return 'Content';
      case 'web_programming': return 'Programming';
      case 'web_marketing': return 'Marketing';
      default: return major;
    }
  };

  const renderSelectedMajorName = (): string => {
    switch (selectedMajor) {
      case 'all': return 'ทั้งหมด';
      case 'design': return 'Web Design';
      case 'content': return 'Web Content';
      case 'programming': return 'Web Programming';
      case 'marketing': return 'Web Marketing';
      default: return 'ทั้งหมด';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="mt-25 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-12">
            รายชื่อผู้ผ่านการคัดเลือก Young Webmaster Camp ครั้งที่ 20
          </h1>

          {/* Search bar and view toggle */}
          <div className="flex items-center gap-4 mb-5">
            <input
              type="text"
              placeholder="ค้นหา"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-lg main-wrap border border-gray-600 px-4 py-3 text-white duration-200 focus:outline-none focus:ring-1"
            />
            <div className="ml-auto">
              <button
                onClick={toggleViewMode}
                className="cursor-pointer bg-y20-gradient hover:bg-red-700 rounded-lg p-3 hover:opacity-90 duration-200"
                aria-label={viewMode === 'list' ? "Switch to grid view" : "Switch to list view"}
              >
                {viewMode === 'list' ? <GridIcon /> : <ListIcon />}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <span className="mr-3 font-semibold">สาขา:</span>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="cursor-pointer text-sm bg-y20-gradient font-semibold rounded-lg px-5 py-2 flex items-center gap-1 hover:opacity-90 duration-200"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {renderSelectedMajorName()}
                  <span className={`-mr-1 transform inline-block duration-100 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <DropdownIcon />
                  </span>
                </button>

                {/* Dropdown */}
                <div
                  ref={contentRef}
                  className={`absolute top-full left-0 mt-2 w-50 bg-black/70 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg shadow-black z-10 overflow-hidden transition-all duration-100 ease-in-out`}
                  style={{
                    height: `${dropdownHeight}px`,
                    opacity: dropdownHeight > 0 ? 1 : 0,
                    transform: `translateY(${dropdownHeight > 0 ? '0' : '-8px'})`,
                    visibility: dropdownHeight === 0 ? 'hidden' : 'visible'
                  }}
                >
                  <ul className="py-2 space-y-1 px-2">
                    {[
                      { id: 'all', label: 'ทั้งหมด' },
                      { id: 'design', label: 'Web Design' },
                      { id: 'content', label: 'Web Content' },
                      { id: 'programming', label: 'Web Programming' },
                      { id: 'marketing', label: 'Web Marketing' }
                    ].map(item => (
                      <li
                        key={item.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700/50 rounded-lg duration-200 ${selectedMajor === item.id ? 'bg-y20-gradient' : ''}`}
                        onClick={() => handleMajorChange(item.id)}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {selectedMajor !== 'all' && (
              <div
                className="flex items-center cursor-pointer hover:underline"
                onClick={() => handleMajorChange('all')}
              >
                <div className="ml-2 text-gray-400">ล้างการกรอง</div>
              </div>
            )}
          </div>
        </div>

        {/* Candidates list */}
        {isLoading ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-10 h-10 border-3 border-white rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">ไม่พบข้อมูลที่ค้นหา</p>
          </div>
        ) : viewMode === 'list' ? (
          // List view
          <div>
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-4 w-1/5">เลขประจำตัว</th>
                  <th className="py-4 px-4 w-1/3">ชื่อ-นามสกุล</th>
                  <th className="py-4 px-4 w-1/4">สาขา</th>
                  <th className="py-4 px-4 w-1/6"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.interviewRefNo}
                    className={`border-b border-gray-800 hover:bg-gray-700/40 duration-200 opacity-0 ${animateView ? 'animate-fadeIn' : ''}`}
                    style={{
                      animationDelay: `${Math.min(index * 30, 500)}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="py-4 px-4">{candidate.interviewRefNo}</td>
                    <td className="py-4 px-4">{candidate.firstName} {candidate.lastName}</td>
                    <td className="py-4 px-4">
                      <span className="bg-y20-gradient text-xs rounded-full font-semibold bg-customGradient text-gradient">
                        {renderMajorName(candidate.major)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/inspect/${candidate.interviewRefNo}`}>
                        <button className="cursor-pointer bg-y20-gradient text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 duration-200">
                          ตรวจสอบ
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Card view
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCandidates.map((candidate, index) => (
              <div
                key={candidate.interviewRefNo}
                className={`flex flex-col justify-between bg-dark-grey border border-gray-600 rounded-lg p-4 hover:border-gray-100 transition-colors duration-200 opacity-0 ${animateView ? 'animate-fadeInUp' : ''}`}
                style={{
                  animationDelay: `${Math.min(index * 30, 500)}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="flex justify-between items-start mb-2 gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.firstName} {candidate.lastName}</h3>
                    <span className="text-gray-400 text-sm">{candidate.interviewRefNo}</span>
                  </div>
                  <span className="bg-y20-gradient text-xs py-1.5 rounded-full font-semibold bg-customGradient text-gradient">
                    {renderMajorName(candidate.major)}
                  </span>
                </div>
                <div className="mt-2">
                  <Link href={`/inspect/${candidate.interviewRefNo}`}>
                    <button className="cursor-pointer bg-y20-gradient text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 duration-200">
                      ตรวจสอบ
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
