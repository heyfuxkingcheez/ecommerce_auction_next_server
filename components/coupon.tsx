'use client';

import React, { useEffect, useState } from 'react';
import { url } from './addressBook';
import { useAuth } from '../context/AuthContext';

type couponType = {
  coupon_coupon_name: string;
  coupon_discount_rate: number;
  coupon_issued_at: Date;
  count: string;
};

const CouponComponent = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<couponType[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const itemsResponse = await fetch(`${url}/coupons`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!itemsResponse.ok) {
          throw Error();
        }

        const responseData = await itemsResponse.json();
        setCoupons([...responseData]);
      } catch (error) {
        console.error(error);
      }
    };

    handleFetch();
  }, []);

  const handleRequestCoupon = async (couponName: string) => {
    try {
      const itemsResponse = await fetch(
        `${url}/coupons/issue?coupon-name=${couponName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        },
      );

      if (!itemsResponse.ok) {
        const errorData = await itemsResponse.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const responseData = await itemsResponse.json();
      if (responseData) {
        alert('쿠폰이 발급 되었습니다.');
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center  bg-white my-8">
      <h1 className="text-2xl font-bold mb-6">쿠폰 드로우</h1>
      {coupons?.map((coupon, index) => (
        <div className="flex flex-col items-center bg-gray-50 rounded-lg shadow-lg p-8 my-4">
          <img
            src="/couponimg.png" // 실제 이미지 경로로 변경해야 합니다
            alt="Product Image"
            className="w-64 h-64 object-contain mb-4"
          />

          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">
              {coupon.coupon_discount_rate}%
            </h2>
            <h2 className="text-lg text-gray-700 mb-2">
              {coupon.coupon_coupon_name}
            </h2>
            <p className="text-red-500 mb-4">남은 쿠폰 : {coupon.count}장</p>
            <button
              onClick={() => handleRequestCoupon(coupon.coupon_coupon_name)}
              className="bg-black text-white text-lg font-medium px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300"
            >
              쿠폰 발급
            </button>
          </div>
        </div>
      ))}

      {/* 하단 오른쪽에 화살표 아이콘 버튼 */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-gray-200 p-3 rounded-full shadow-lg hover:bg-gray-300 transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CouponComponent;
