'use client';

import { ItemType } from '@/app/products/[id]/page';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { url } from './addressBook';

interface BidPopupProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemType; // 실제 데이터 타입에 맞게 수정
}

export type ItemOptionWithLowestPriceResponseType = {
  item_id: string;
  item_created_at: Date;
  item_updated_at: Date;
  item_item_name_kr: string;
  item_item_name_en: string;
  item_model_number: string;
  item_release_price: number;
  item_release_date: Date;
  itemOption_id: string;
  itemOption_created_at: Date;
  itemOption_updated_at: Date;
  itemOption_option: string;
  itemOption_itemId: string;
  minPurchaseBiddingPrice: number;
};

const SaleBidPopup: React.FC<BidPopupProps> = ({ isOpen, onClose, item }) => {
  const [optionData, setOptionData] = useState<string>('');
  const [priceData, setPriceData] = useState<
    ItemOptionWithLowestPriceResponseType[] | null
  >(null);
  const { token } = useAuth();
  const router = useRouter();

  const handleOnClose = () => {
    onClose();
    setOptionData('');
  };

  const handleSale = () => {
    router.push(`/sale/${item.id}?itemOptionId=${optionData}`);
  };

  useEffect(() => {
    async function getFetchData() {
      try {
        const itemOptionPriceResponse = await fetch(
          `${url}/auctions/purchase-bid/${item.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `${token}`,
            },
          },
        );
        const responseData = await itemOptionPriceResponse.json();

        if (!itemOptionPriceResponse.ok) {
          throw Error(responseData.error);
        }
        if (responseData) setPriceData(responseData);
        console.log(responseData);
      } catch (error) {
        console.error(error);
      }
    }

    if (isOpen) {
      getFetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">판매</h2>
          <button
            onClick={handleOnClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="flex items-center mb-4">
          <img
            src={`http://localhost:3000/${item.images[0].path}`}
            alt={item.item_name_kr}
            className="w-16 h-16 rounded-md"
          />
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{item.item_name_kr}</h3>
            <p className="text-sm text-gray-500">{item.model_number}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {item.itemOptions?.map((option: any) => (
            <div
              onClick={() => setOptionData(option.id)}
              key={option.id}
              className={`border p-2 rounded-md text-center cursor-pointer transition duration-200 ease-in-out
             ${
               optionData === option.id
                 ? 'bg-gray-100 shadow-lg'
                 : 'hover:bg-gray-100 hover:shadow-lg'
             }`}
            >
              <p className="text-lg font-bold">{option.option}</p>
              {priceData ? (
                // priceData가 있는 경우
                priceData.some((price) => price.itemOption_id === option.id) ? (
                  priceData.map((price) =>
                    price.itemOption_id === option.id ? (
                      <p
                        key={price.itemOption_id}
                        className="text-sm text-blue-500"
                      >
                        {price.minPurchaseBiddingPrice}
                      </p>
                    ) : null,
                  )
                ) : (
                  <p className="text-sm text-blue-500">미입찰</p>
                )
              ) : (
                // priceData가 없는 경우
                <p className="text-sm text-blue-500">미입찰</p>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSale}
          className={` ${optionData ? 'mt-6 bg-blue-500 text-white py-2 px-4 rounded-md w-full' : 'hidden'}`}
        >
          판매
        </button>
      </div>
    </div>
  );
};

export default SaleBidPopup;
