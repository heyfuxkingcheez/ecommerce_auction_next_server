'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MyInfo from './myInfo';
import Profile from './profile';

export default function MyPage() {
  const path = usePathname();
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-64 bg-white p-8 border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-8">마이 페이지</h2>
        <ul className="space-y-6">
          <li>
            {path === '/mypage' ? (
              <Link className="font-semibold mt-8" href={'/mypage'}>
                내 정보
              </Link>
            ) : (
              <Link href={'/mypage'}>내 정보</Link>
            )}
          </li>
          <li>
            {path === '/mypage/profile' ? (
              <Link className="font-semibold mt-8" href="/mypage/profile">
                프로필 관리
              </Link>
            ) : (
              <Link href="/mypage/profile">프로필 관리</Link>
            )}
          </li>
          <li>
            {path === '/mypage/address' ? (
              <Link className="font-semibold mt-8" href="/mypage/address">
                주소록
              </Link>
            ) : (
              <Link href="/mypage/address">주소록</Link>
            )}
          </li>
          <li>
            {path === '/mypage/payments' ? (
              <Link className="font-semibold mt-8" href="/mypage/payments">
                결제 정보
              </Link>
            ) : (
              <Link href="/mypage/payments">결제 정보</Link>
            )}
          </li>
          <li>
            {path === '/mypage/account' ? (
              <Link className="font-semibold mt-8" href="/mypage/account">
                정산 계좌
              </Link>
            ) : (
              <Link href="/mypage/account">정산 계좌</Link>
            )}
          </li>
          <li>
            {path === '/mypage/purchases' ? (
              <Link className="font-semibold mt-8" href="/mypage/purchases">
                구매 내역
              </Link>
            ) : (
              <Link href="/mypage/purchases">구매 내역</Link>
            )}
          </li>
          <li>
            {path === '/mypage/sales' ? (
              <Link className="font-semibold mt-8" href="/mypage/sales">
                판매 내역
              </Link>
            ) : (
              <Link href="/mypage/sales">판매 내역</Link>
            )}
          </li>
        </ul>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8">
        <div className="w-full h-full border border-gray-300 rounded-lg p-8">
          {path === '/mypage' && <MyInfo />}
          {path === '/mypage/profile' && <Profile />}
        </div>
      </main>
    </div>
  );
}
