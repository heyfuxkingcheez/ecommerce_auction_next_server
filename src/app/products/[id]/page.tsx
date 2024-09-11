'use client';
import { useEffect, useState } from 'react';
import PurchaseBidPopup from '../../../../components/purchaseBidPopup';
import SaleBidPopup from '../../../../components/saleBidPopup';
import { url } from '../../../../components/addressBook';

export interface ItemType {
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
      created_at: Date;
      updated_at: Date;
      order: number;
      type: number;
      path: string;
    },
  ];
  itemOptions: [
    {
      id: string;
      created_at: Date;
      updated_at: Date;
      option: string;
    },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  const [itemData, setItemData] = useState<ItemType | null>(null);
  const [isPurchaseBidPopupOpen, setIsPurchaseBidPopupOpen] = useState(false);
  const [isSaleBidPopupOpen, setIsSaleBidPopupOpen] = useState(false);

  const product = {
    name: "Nike Air Force 1 '07 WB Flax",
    price: 139000,
    recentTrade: 142000,
    releasePrice: 169000,
    modelNumber: 'CJ9179-200',
    releaseDate: '19/09/10',
    colors: 'Flax/Gum/Light Brown/Black/Wheat',
    sizes: ['모든 사이즈', '250', '260', '270', '280'],
  };

  useEffect(() => {
    async function getFetchData() {
      try {
        const itemsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/items/${params.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!itemsResponse.ok) {
          throw Error();
        }

        const responseData = await itemsResponse.json();
        if (responseData) setItemData(responseData);
      } catch (error) {
        console.error(error);
      }
    }

    getFetchData();
  }, [params.id]);

  return (
    <div className="min-h-screen max-w-screen-2xl mx-auto flex flex-col md:flex-row p-8">
      {/* 좌측 이미지 영역 */}
      <div className="flex flex-col items-center md:w-1/2">
        <img
          src={`${url}/${itemData?.images[0].path}`}
          alt="Product"
          className="w-3/4  h-auto"
        />
      </div>

      {/* 우측 상세 정보 영역 */}
      <div className="md:w-1/2 md:pl-8">
        <h1 className="text-4xl font-bold">{itemData?.item_name_kr}</h1>
        <h3 className="text-2xl font-extralight">{itemData?.item_name_en}</h3>
        <h3 className="font-bold text-2xl mt-2">{itemData?.release_price}원</h3>
        <div className="flex mt-4 space-x-4">
          <button
            onClick={() => setIsPurchaseBidPopupOpen(true)}
            className="font-bold bg-red-500 text-white py-4 w-1/2 rounded-md"
          >
            구매 입찰
          </button>
          <button
            onClick={() => setIsSaleBidPopupOpen(true)}
            className="font-bold bg-blue-500 text-white py-4 w-1/2  rounded-md"
          >
            판매 입찰
          </button>
        </div>
        <div className="mt-6">
          <p>관심상품: 16.9만</p>
        </div>

        <div className="mt-6 bg-gray-100 border border-gray-300 p-4 rounded-md">
          <p>최근 거래가: {product.recentTrade.toLocaleString()}원</p>
          <p>발매가: {itemData?.release_price}원</p>
          <p>모델 번호: {itemData?.model_number}</p>
          <p>출시일: {itemData?.release_date}</p>
        </div>

        <div className="mt-6 bg-gray-100 border border-gray-300 p-4 rounded-md">
          <h2 className="font-bold mb-2">추가 혜택</h2>
          <p>계좌 간편결제 시 1% 적립</p>
        </div>

        <div className="mt-6 bg-gray-100 border border-gray-300 p-4 rounded-md">
          <h2 className="font-bold mb-2">배송 정보</h2>
          <p>빠른배송: 5,000원 - 지금 결제 시 내일 도착 예정</p>
          <p>일반배송: 3,000원 - 검사 후 배송, 5-7일 내 도착 예정</p>
          <p>창고보관 30일 무료</p>
        </div>
      </div>

      {itemData && (
        <PurchaseBidPopup
          isOpen={isPurchaseBidPopupOpen}
          onClose={() => setIsPurchaseBidPopupOpen(false)}
          item={itemData}
        />
      )}
      {itemData && (
        <SaleBidPopup
          isOpen={isSaleBidPopupOpen}
          onClose={() => setIsSaleBidPopupOpen(false)}
          item={itemData}
        />
      )}
    </div>
  );
}
