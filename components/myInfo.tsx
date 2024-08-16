import React from 'react';

export default function MyInfo() {
  return (
    <div className="p-8 rounded-lg flex flex-col space-y-8">
      {/* 상단 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          {/* 프로필 이미지 */}
          <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
          {/* 닉네임 및 이메일 */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">닉네임</h2>
            <p className="text-gray-600">example@gmail.com</p>
          </div>
        </div>
        {/* 쿠폰 아이콘 */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
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
