// components/PurchaseBidComponent.tsx
'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { saleBidDataType } from '@/app/sale/[id]/page';

export type ItemType = {
  id: string;
  created_at: Date;
  updated_at: Date;
  option: string;
  item: {
    id: string;
    created_at: Date;
    updated_at: Date;
    item_name_kr: string;
    item_name_en: string;
    model_number: string;
    release_price: number;
    release_date: string;
    images: [
      {
        id: string;
        created_at: string;
        updated_at: string;
        order: number;
        type: number;
        path: string;
      },
    ];
  };
  saleBidding: [
    {
      id: string;
      created_at: string;
      updated_at: string;
      price: number;
      expired_date: string;
      status: string;
    },
  ];
};

type PurchaseBidComponentProps = {
  params: { id: string };
  onSubmit: (
    itemData: ItemType | null,
    desiredPrice: string,
    expiredDate: string,
  ) => void;
  setSaleBidData: React.Dispatch<React.SetStateAction<saleBidDataType | null>>;
};

const SaleBidContinueComponent: React.FC<PurchaseBidComponentProps> = ({
  params,
  onSubmit,
  setSaleBidData,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [itemData, setItemData] = useState<ItemType | null>(null);
  const [desiredPrice, setDesiredPrice] = useState('');
  const [expiredDate, setExpiredDate] = useState('');

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    const date = new Date();
    date.setDate(date.getDate() + duration);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setExpiredDate(formattedDate);
  };

  const handlePurchaseClick = () => {
    onSubmit(itemData, desiredPrice, expiredDate);
    setSaleBidData((prevData) => ({
      ...prevData,
      itemOptionId: prevData?.itemOptionId ?? '',
      addressId: prevData?.addressId ?? '',
      price: desiredPrice ? parseFloat(desiredPrice.replace(/,/g, '')) : 0,
      expired_date: expiredDate ?? '',
    }));
  };

  const formatNumber = (value: string) => {
    const number = parseInt(value.replace(/,/g, ''), 10);
    return isNaN(number) ? '' : new Intl.NumberFormat('ko-KR').format(number);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setDesiredPrice(formatNumber(value));
  };

  return (
    <div className="max-w-screen-md mx-auto px-6 py-2">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="mb-4">
            <label className="text-lg font-bold" htmlFor="desiredPrice">
              판매 희망가
            </label>
            <div className="flex items-center mt-2">
              <input
                id="desiredPrice"
                type="text"
                value={desiredPrice}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-gray-500 outline-none text-xl font-bold text-black-500 text-right"
                placeholder="희망가 입력"
              />
              <span className="ml-2 text-xl font-bold text-black-500">원</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            총 결제금액은 다음 화면에서 계산됩니다.
          </p>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <h3 className="font-bold mb-4">입찰 마감기한</h3>
          <div className="flex justify-between">
            {[1, 3, 7, 30, 60, 90, 180].map((duration) => (
              <button
                key={duration}
                onClick={() => handleDurationChange(duration)}
                className={`w-full py-2 px-4 rounded-md border ${
                  selectedDuration === duration
                    ? 'bg-gray-100 border-gray-500'
                    : 'border-gray-300'
                }`}
              >
                {duration}일
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {selectedDuration}일 (
            {new Date(
              new Date().setDate(new Date().getDate() + selectedDuration),
            ).toLocaleDateString()}{' '}
            마감)
          </p>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <button
            onClick={handlePurchaseClick}
            className={
              desiredPrice && selectedDuration !== 0
                ? 'bg-blue-500 text-white py-4 rounded-md font-bold w-full'
                : 'bg-gray-300 text-gray-500 py-4 rounded-md font-bold w-full'
            }
            disabled={!desiredPrice && selectedDuration === 0}
          >
            판매 입찰 계속
          </button>
          <p className="text-sm text-gray-500 text-center mt-4">
            다음 화면에서 확인
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleBidContinueComponent;
