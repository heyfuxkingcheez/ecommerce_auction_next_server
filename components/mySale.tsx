import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { url } from './addressBook';

type PurchaseType = {
  id: string;
  created_at: string;
  updated_at: string;
  price: number;
  expired_date: string;
  status: 'ONGOIN' | 'MATCHED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  delivery_instruection: string;
  itemOption: {
    id: string;
    created_at: string;
    updated_at: string;
    option: string;
    item: {
      id: string;
      created_at: string;
      updated_at: string;
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
  };
};

const MySales = () => {
  const { token } = useAuth();
  const [sales, setSales] = useState<PurchaseType[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    handleFetch('ONGOING', 'all');
  }, []);

  const handleFetch = async (status: string, method: string) => {
    setSelectedTab(method);
    try {
      const response = await fetch(`${url}/auctions/me/sale-bid/${status}`, {
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

      setSales(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">판매 내역</h1>
      <div className="flex justify-between items-center w-full mb-8 my-8">
        <div
          className={`flex-1 flex flex-col items-center text-center cursor-pointer ${
            selectedTab === 'all' ? 'border-b-2 border-black' : ''
          }`}
          onClick={() => handleFetch('ONGOING', 'all')}
        >
          <h2
            className={`text-2xl font-bold ${selectedTab === 'all' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            57
          </h2>
          <p className="text-gray-600">판매 일찰</p>
        </div>
        <div
          className={`flex-1 flex flex-col items-center text-center cursor-pointer ${
            selectedTab === 'in-progress' ? 'border-b-2 border-black' : ''
          }`}
          onClick={() => handleFetch('MATCHED', 'in-progress')}
        >
          <h2
            className={`text-2xl font-bold ${selectedTab === 'in-progress' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            0
          </h2>
          <p className="text-gray-600">진행 중</p>
        </div>
        <div
          className={`flex-1 flex flex-col items-center text-center cursor-pointer ${
            selectedTab === 'completed' ? 'border-b-2 border-black' : ''
          }`}
          onClick={() => handleFetch('COMPLETED', 'completed')}
        >
          <h2
            className={`text-2xl font-bold ${selectedTab === 'completed' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            12
          </h2>
          <p className="text-gray-600">종료</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 p-4"></div>
        <div>
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center p-4 border-b border-gray-200"
            >
              <img
                src={`${url}/${sale.itemOption.item.images[0].path}`}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {sale.itemOption.item.item_name_kr}
                </h3>
                <p className="text-gray-500 text-sm">
                  {sale.itemOption.item.item_name_en}
                </p>
                <p className="text-gray-500 text-sm">
                  {sale.itemOption.option}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">{sale.price}원</p>
                <p className="text-blue-500 text-sm">{sale.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySales;
