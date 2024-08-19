import React, { useEffect, useState } from 'react';
import AddressPopup from './addressPopup';
import { useAuth } from '../context/AuthContext';

const url = process.env.NEXT_PUBLIC_API_URL;

export interface AddressType {
  id: string;
  created_at: Date;
  updated_at: Date;
  address_name: string;
  name: string;
  address: string;
  userId: string;
  zip_code: string;
}

export default function AddressBook() {
  const { isLoggedIn, token, checkAuthStatus } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [addressData, setAddressData] = useState<AddressType[]>([]);

  useEffect(() => {
    async function postFetchData() {
      try {
        const userResponse = await fetch(`${url}/users/address_books`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        });

        if (!userResponse.ok) {
          throw Error;
        }

        const userAddressData = await userResponse.json();
        if (userAddressData) setAddressData(userAddressData);
      } catch (error) {
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    if (token && isLoggedIn !== false) {
      postFetchData();
    }
  }, [token, isLoggedIn]);

  async function deleteFetchData(addressId: string) {
    try {
      const userResponse = await fetch(
        `${url}/users/address_books/${addressId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        },
      );

      if (!userResponse.ok) {
        throw Error;
      }

      setAddressData((pre) =>
        pre.filter((address) => address.id !== addressId),
      );
    } catch (error) {
      throw new Error('삭제 실패');
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">주소록</h2>
        <button
          className="border border-gray-400 rounded-full px-4 py-2 text-sm"
          onClick={() => setIsPopupOpen(true)}
        >
          + 새 배송지 추가
        </button>
      </div>

      {addressData?.map((address) => (
        <div key={address?.id} className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-bold">{address?.address_name} </div>
              <span className="font-normal text-sm text-gray-700">
                {address?.name}
              </span>
              <div className="text-sm text-gray-500">{address?.address}</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteFetchData(address?.id)}
                className="border border-gray-400 rounded-full px-4 py-2 text-sm"
              >
                삭제
              </button>
            </div>
          </div>
          {/* {address?.id < addressData.length && <hr className="my-4" />} */}
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <button className="px-4 py-2 border border-gray-400 rounded-full text-sm">
          1
        </button>
      </div>

      {/* AddressPopup 컴포넌트 */}
      <AddressPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        setAddressData={setAddressData}
      />
    </div>
  );
}
