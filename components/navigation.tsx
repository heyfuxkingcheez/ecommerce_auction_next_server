'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const path = usePathname();
  const { isLoggedIn, logout, checkAuthStatus } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [isLoggedIn]);

  return (
    <nav className="bg-white shadow-sm">
      {/* 상단 레이어 */}
      <div className="container mx-auto flex justify-end space-x-6 text-sm py-2 px-6 hidden md:flex">
        <span>
          {!isLoggedIn && <Link href="/login">마이페이지</Link>}
          {isLoggedIn && <Link href="/mypage">마이페이지</Link>}
        </span>
        <span>
          {!isLoggedIn && <Link href="/login">관심</Link>}
          {isLoggedIn && <Link href="/like">관심</Link>}
        </span>
        <span>
          {!isLoggedIn && <Link href="/login">알림</Link>}
          {isLoggedIn && <Link href="/alarm">알림</Link>}
        </span>
        <span>
          {!isLoggedIn && <Link href="/login">로그인</Link>}
          {isLoggedIn && <button onClick={logout}>로그아웃</button>}
        </span>
      </div>

      {/* 하단 레이어 */}
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-black">
            <Link href="/">STOCKTEM</Link>
          </h1>
        </div>
        <div className="hidden md:flex space-x-10">
          <span>
            {path === '/' ? (
              <Link className="font-extrabold" href="/">
                HOME
              </Link>
            ) : (
              <Link href="/">HOME</Link>
            )}
          </span>
          <span>
            {path === '/shop' ? (
              <Link className="font-extrabold" href="/shop">
                SHOP
              </Link>
            ) : (
              <Link href="/shop">SHOP</Link>
            )}
          </span>
          <span>
            <Link href="/search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Link>
          </span>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <button
            className="text-gray-500 focus:outline-none"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-4 pb-4">
          <span>
            {path === '/' ? (
              <Link className="font-extrabold" href="/">
                HOME
              </Link>
            ) : (
              <Link href="/">HOME</Link>
            )}
          </span>
          <span>
            {path === '/shop' ? (
              <Link className="font-extrabold" href="/shop">
                SHOP
              </Link>
            ) : (
              <Link href="/shop">SHOP</Link>
            )}
          </span>
          <span>
            <Link href="/search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Link>
          </span>
          <span>
            {!isLoggedIn && <Link href="/login">마이페이지</Link>}
            {isLoggedIn && <Link href="/users">마이페이지</Link>}
          </span>
          <span>
            {!isLoggedIn && <Link href="/login">관심</Link>}
            {isLoggedIn && <Link href="/like">관심</Link>}
          </span>
          <span>
            {!isLoggedIn && <Link href="/login">알림</Link>}
            {isLoggedIn && <Link href="/alarm">알림</Link>}
          </span>
          <span>
            {!isLoggedIn && <Link href="/login">로그인</Link>}
            {isLoggedIn && <button onClick={logout}>로그아웃</button>}
          </span>
        </div>
      )}
    </nav>
  );
}
