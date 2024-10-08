'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const url = process.env.NEXT_PUBLIC_API_URL;

const categories = ['전체', '상의', '하의', '신발', '샌들', '모자'];

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
  const [itemsData, setItemsData] = useState<ItemType[]>([]);
  const [cursorData, setCursorData] = useState<string | null>(null); // 다음 페이지의 URL을 저장할 상태
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const loaderRef = useRef(null); // 스크롤 지점을 감지하기 위한 ref
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const category = searchParams.get('category') || '전체';
    if (category !== '전체' && category) {
      setSelectedCategory(category);
      getFilterFetchData(category);
    } else if (category && category === '전체') {
      getFetchData();
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const getFetchData = async () => {
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
      console.log(responseData);
      if (responseData) {
        setItemsData(responseData.data);
        setCursorData(responseData.next); // 다음 데이터를 가져올 URL 저장
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFilterFetchData = async (category: string) => {
    try {
      const itemsResponse = await fetch(`${url}/tags/items/${category}`, {
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
      if (responseData) {
        setItemsData(responseData);
        setCursorData(responseData.next); // 필터된 데이터에도 next URL 설정
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 추가 데이터를 로드하는 함수
  const fetchMoreData = async () => {
    if (!cursorData) return;

    try {
      const moreDataResponse = await fetch(cursorData, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!moreDataResponse.ok) {
        throw Error();
      }

      const moreData = await moreDataResponse.json();
      console.log(moreData);

      setItemsData((prevItems) => [...prevItems, ...moreData.data]); // 기존 데이터에 추가
      setCursorData(moreData.next); // 다음 페이지 URL 업데이트
    } catch (error) {
      console.error(error);
    }
  };

  // 스크롤 위치를 감지하여 데이터 추가 요청
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursorData) {
          fetchMoreData(); // 사용자가 스크롤을 끝까지 내리면 추가 데이터 로드
        }
      },
      { threshold: 1.0 }, // 100%가 보일 때 로드
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [cursorData]);

  const handleCategoryChange = (event: any) => {
    const newCategory = event.target.value;
    router.push(`/shop?category=${newCategory}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-64 bg-white p-8 border-r border-gray-200 fixed h-full">
        <h2 className="text-xl font-bold mb-8">필터</h2>
        <ul className="space-y-4">
          {categories.map((category, index) => (
            <li key={index} className="flex items-center">
              <input
                type="radio"
                id={`category-${index}`}
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={handleCategoryChange}
                className="mr-2 h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`category-${index}`} className="text-gray-700">
                {category}
              </label>
            </li>
          ))}
        </ul>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8 ml-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {itemsData.map((product) => (
            <div
              key={product.id}
              className="w-58 h-58 rounded-lg p-4 flex flex-col justify-between cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <img
                src={`${url}/${product.images[0].path}`}
                className="w-full h-40 mb-4 bg-gray-300 rounded-lg object-cover"
              />
              <div className="flex-grow">
                <div className="pl-1">
                  <p className="text-sm font-semibold text-lg">
                    {product.item_name_kr}
                  </p>
                  <p className="text-xs text-black-500">
                    {product.item_name_kr}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.item_name_en}
                  </p>
                  <p className="text-sm font-bold text-lg mt-2">
                    {`${product.release_price}원`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 로딩 지점 */}
        <div ref={loaderRef} className="h-10" />
      </main>
    </div>
  );
};
