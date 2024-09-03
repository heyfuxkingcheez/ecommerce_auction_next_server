'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { url } from './addressBook';

type HotItemsDataType = {
  item_id: string;
  item_item_name_kr: string;
  item_item_name_en: string;
  path: string;
  price: number;
  item_count: string;
};

export default function Main() {
  const router = useRouter();
  const [hotItemsData, setHotItemsData] = useState<HotItemsDataType[]>([]);

  useEffect(() => {
    const getHotItemFetchData = async () => {
      try {
        const itemsResponse = await fetch(`${url}/auctions/hot`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!itemsResponse.ok) {
          throw Error();
        }

        const responseData = await itemsResponse.json();
        console.log(responseData);
        if (responseData) setHotItemsData(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    getHotItemFetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 배너 */}
      <div className="bg-gray-300 h-96 flex items-center justify-center">
        <img src="/Group 42.png" className="w-full h-full object-cover" />
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="flex justify-center mt-4">
        <div className="w-3 h-3 bg-black rounded-full mx-1"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full mx-1"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full mx-1"></div>
      </div>

      {/* 그리드 항목들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 max-w-screen-lg mx-auto">
        {[
          {
            title: '쿠폰 드로우',
            subtitle: '쿠폰 드로우',
            img: '/coupon.png',
            link: '/coupon',
          },
          { title: '랭킹', subtitle: '랭킹', img: '/ranking.png', link: '' },
          {
            title: '신발',
            subtitle: '신발',
            img: '/신발.png',
            link: '/shop?category=신발',
          },
          { title: '정가 아래', subtitle: '정가 아래', img: '/정가아래.png' },
          {
            title: '모자',
            subtitle: '모자',
            img: '/모자.png',
            link: '/shop?category=모자',
          },
          {
            title: '샌들',
            subtitle: '샌들',
            img: '/샌들.png',
            link: '/shop?category=샌들',
          },
          {
            title: '상의',
            subtitle: '상의',
            img: '/상의.png',
            link: '/shop?category=상의',
          },
          {
            title: '하의',
            subtitle: '하의',
            img: '/하의.png',
            link: '/shop?category=하의',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => router.push(`${item?.link}`)}
          >
            <div className="bg-gray-200 rounded-lg flex items-center justify-center w-full h-40">
              {/* 이곳에 이미지나 아이콘을 추가할 수 있습니다. */}
              <img
                src={item.img}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Most Popular 섹션 */}
      <div className="max-w-screen-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Most Popular</h2>
        <p className="text-gray-500 mb-8">인기 상품</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          {hotItemsData.map((product, index) => (
            <div
              key={index}
              className="rounded-lg p-4 flex flex-col cursor-pointer"
              onClick={() => router.push(`/products/${product.item_id}`)}
            >
              <img
                src={`http://localhost:3000/public/items/${product.path}`}
                className="w-full h-40 mb-4 bg-gray-300 rounded-lg object-cover"
              />
              <p className="text-sm font-semibold text-lg">
                {product.item_item_name_kr}
              </p>
              <p className="text-xs text-gray-500">
                {product.item_item_name_en}
              </p>
              <p className="text-sm font-bold text-lg mt-2">
                {`${product.price}원`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
