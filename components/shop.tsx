'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const url = process.env.NEXT_PUBLIC_API_URL;

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
}

export const Shop = () => {
  const [itemsData, setItemsData] = useState<ItemType[] | null>(null);
  const [cursorData, setCursorData] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function getFetchData() {
      try {
        const itemsResponse = await fetch(`${url}/items`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!itemsResponse.ok) {
          throw Error();
        }

        const responseData = await itemsResponse.json();
        if (responseData) setItemsData(responseData.data);
      } catch (error) {
        console.error(error);
      }
    }

    getFetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-64 bg-white p-8 border-r border-gray-200 fixed h-full">
        <h2 className="text-xl font-bold mb-8">필터</h2>
        <ul className="space-y-6"></ul>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8 ml-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {itemsData?.map((product, index) => (
            <div
              key={product.id}
              className="w-48 rounded-lg p-4 flex flex-col"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <img
                src={`http://localhost:3000/${product.images[0].path}`}
                className="w-full h-40 mb-4 bg-gray-300 rounded-lg"
              />
              <div className="pl-1">
                <p className="text-sm font-semibold text-lg">
                  {product.item_name_kr}
                </p>
                <p className="text-xs text-black-500">{product.item_name_kr}</p>
                <p className="text-xs text-gray-500">{product.item_name_en}</p>
                <p className="text-sm font-bold text-lg mt-2">
                  {`${product.release_price}원`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
