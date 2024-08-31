import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { url } from './addressBook';
import dayjs from 'dayjs';

const coupons = [
  {
    discount: '10%',
    title: '8월 신규 가입 쿠폰 10%',
    brand: '브랜드',
    description: '브랜드배송 선택 시 사용가능 • 일부 상품 제외',
    expiry: '24/08/31 23:59:59 까지',
    dDay: '오늘 종료',
  },
];

type couponType = {
  coupon: {
    coupon_name: string;
    created_at: string;
    discount_rate: number;
    expired_at: string;
    id: string;
    issued_at: string;
    status: 'ISSUED' | 'PENDDING';
    updated_at: string;
  };
  created_at: string;
  id: string;
  updated_at: string;
};

const MyCoupons = () => {
  const { token } = useAuth();
  const [userCoupons, setUserCoupons] = useState<couponType[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await fetch(`${url}/coupons/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw Error();
        }

        const responseData = await response.json();
        setUserCoupons(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    handleFetch();
  }, [token]);

  const calculateDDay = (expiredAt: string) => {
    const now = dayjs();
    const expirationDate = dayjs(expiredAt);
    const difference = expirationDate.diff(now, 'day');

    if (difference < 0) {
      return '만료됨';
    } else if (difference === 0) {
      return '오늘 만료';
    } else {
      return `D-${difference}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">쿠폰</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCoupons.map((coupon, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-md"
          >
            <div className="text-4xl font-bold text-black-500 mb-4">
              {coupon.coupon.discount_rate}%
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {coupon.coupon.coupon_name}
            </h2>
            <div className="border-t border-dashed border-gray-300 mt-4 pt-4">
              <p className="text-red-500 font-semibold">
                {calculateDDay(coupon.coupon.expired_at)}
              </p>
              <p className="text-gray-500 text-sm">
                {coupon.coupon.expired_at}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoupons;
