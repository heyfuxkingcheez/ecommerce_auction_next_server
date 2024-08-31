import React, { use, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  nickname: string;
  email: string;
  phone_number: string;
  role: string;
  image: string;
}

export default function MyInfo() {
  const { token, isLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('http://localhost:3000/api/users/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        });

        if (!userResponse.ok) {
          throw Error;
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        // console.error(error);
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    if (token && isLoggedIn !== false) {
      fetchData();
    }
  }, [isLoggedIn]);

  return (
    <div className="p-8 rounded-lg flex flex-col space-y-8">
      {/* 상단 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          {/* 프로필 이미지 */}
          <img
            src={`http://localhost:3000${user && user.image}`}
            className="w-32 h-32 bg-gray-300 rounded-lg"
          />
          {/* 닉네임 및 이메일 */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{user && user.nickname}</h2>
            <p className="text-gray-600">{user && user.email}</p>
          </div>
        </div>
        {/* 쿠폰 아이콘 */}
        <div className="flex flex-col items-center">
          <img className="w-12 h-12 object-contain" src={`/couponimg.png`} />
          <p className="text-sm mt-2">쿠폰</p>
        </div>
      </div>

      {/* 관심 상품 */}
      <div>
        <h3 className="text-xl font-bold">관심 상품</h3>
        {/* 관심 상품 리스트가 여기에 들어갈 수 있습니다 */}
      </div>
    </div>
  );
}
