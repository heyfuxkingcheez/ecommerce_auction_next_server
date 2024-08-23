'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { ItemType } from './purchaseBidContinue';
import { BidDataType } from '@/app/purchase/[id]/page';

type PurchaseBidComponentProps = {
  params: { id: string };
  setPurchaseBidData: React.Dispatch<React.SetStateAction<BidDataType | null>>;
};

const PurchaseBidItemComponent: React.FC<PurchaseBidComponentProps> = ({
  params,
  setPurchaseBidData,
}) => {
  const { token } = useAuth();
  const [itemData, setItemData] = useState<ItemType | null>(null);
  const searchParams = useSearchParams();
  const itemOptionId = searchParams.get('itemOptionId');

  useEffect(() => {
    async function getFetchData() {
      try {
        const itemOptionPriceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/items/${params.id}/item-options/${itemOptionId}`,
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

        if (responseData) {
          console.log('itemOptionId =>', responseData.id);
          setItemData(responseData);
          setPurchaseBidData((prevData) => ({
            ...prevData,
            itemOptionId: responseData.id ?? '',
            price: prevData?.price ?? 0,
            addressId: prevData?.addressId ?? '',
            paymentId: prevData?.paymentId ?? '',
            delivery_instruction: prevData?.delivery_instruction ?? '',
            expired_date: prevData?.expired_date ?? '',
            payment_password: prevData?.payment_password ?? '',
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }

    getFetchData();
  }, [token]);
  return (
    <div className={'max-w-screen-md mx-auto px-6 py-2'}>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-4">
          {
            <img
              src={`http://localhost:3000/${itemData?.item.images[0].path}`}
              alt="상품 이미지"
              className="w-24 h-24 rounded-md"
            />
          }

          <div className="ml-4">
            <h2 className="text-xl font-bold">{itemData?.item.model_number}</h2>
            <p className="text-black-500">{itemData?.item.item_name_kr}</p>
            <p className="text-xs text-gray-500">
              {itemData?.item.item_name_en}
            </p>
            <p className="text-xs text-gray-500">{itemData?.option}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBidItemComponent;
