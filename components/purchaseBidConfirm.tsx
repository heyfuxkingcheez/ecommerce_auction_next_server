'use client';

import { BidDataType } from '@/app/purchase/[id]/page';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface PurchaseBidConfirmComponentProps {
  purchaseBidData: BidDataType | null;
}

const PurchaseBidConfirmComponent: React.FC<
  PurchaseBidConfirmComponentProps
> = ({ purchaseBidData }) => {
  const { token } = useAuth();
  const router = useRouter();

  const immediatePurchasePrice = purchaseBidData?.price ?? 0; // 즉시 구매가
  const inspectionFee = 0; // 검사비
  const serviceFee = immediatePurchasePrice * 0.03; // 수수료
  const shippingFee = 3000; // 배송비
  const couponDiscount = 0; // 쿠폰 할인

  const totalAmount =
    immediatePurchasePrice +
    inspectionFee +
    serviceFee +
    shippingFee -
    couponDiscount;

  const handleBidConfirmFetch = async () => {
    try {
      const itemOptionPriceResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/purchase-bid`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
          body: JSON.stringify(purchaseBidData),
        },
      );
      const responseData = await itemOptionPriceResponse.json();

      if (!itemOptionPriceResponse.ok) {
        throw Error(responseData.error);
      }

      if (responseData) {
        alert('구매 입찰이 등록 되었습니다!');
        router.push('/shop');
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-6 py-2">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">최종 주문정보</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">즉시 구매가</span>
            <span className="font-bold">
              {immediatePurchasePrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">검사비</span>
            <span className="font-bold">무료</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">수수료</span>
            <span className="font-bold">{serviceFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">배송비</span>
            <span className="font-bold">{shippingFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">쿠폰 사용</span>
            <span className="font-bold">-</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-lg font-bold">총 결제금액</span>
            <span className="text-lg font-bold">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
        <button
          onClick={handleBidConfirmFetch}
          className="bg-red-500 text-white py-4 rounded-md font-bold w-full"
        >
          {totalAmount.toLocaleString()}원 ・ 입찰 결제하기
        </button>
      </div>
    </div>
  );
};

export default PurchaseBidConfirmComponent;
