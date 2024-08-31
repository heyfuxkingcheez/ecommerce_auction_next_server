'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { BidDataType } from '@/app/purchase/[id]/page';
import { AddressType, url } from './addressBook';
import { useAuth } from '../context/AuthContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
config.autoAddCss = false;

export interface PurchaseBidAddressComponentProps {
  setPurchaseBidData: React.Dispatch<React.SetStateAction<BidDataType | null>>;
}

const PurchaseBidAddressComponent: React.FC<
  PurchaseBidAddressComponentProps
> = ({ setPurchaseBidData }) => {
  const [addressData, setAddressData] = useState<AddressType[]>([]);
  const [seletedAddress, setSeletedAddress] = useState({
    id: '',
    address_name: '',
    name: '',
    address: '',
    zip_code: '',
  });
  const { token } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  const handleAddressChange = (address: AddressType) => {
    setSeletedAddress({
      id: address.id,
      address_name: address.address_name,
      name: address.name,
      address: address.address,
      zip_code: address.zip_code,
    });
    setShowOptions(false);

    setPurchaseBidData((prevData) => ({
      ...prevData,
      itemOptionId: prevData?.itemOptionId ?? '',
      price: prevData?.price ?? 0,
      addressId: address.id ?? '',
      paymentId: prevData?.paymentId ?? '',
      delivery_instruction: prevData?.delivery_instruction ?? '',
      expired_date: prevData?.expired_date ?? '',
      payment_password: prevData?.payment_password ?? '',
    }));
  };

  const handleInstructionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseBidData((prevData) => ({
      ...prevData,
      itemOptionId: prevData?.itemOptionId ?? '',
      price: prevData?.price ?? 0,
      addressId: prevData?.addressId ?? '',
      paymentId: prevData?.paymentId ?? '',
      delivery_instruction: e.target.value ?? '',
      expired_date: prevData?.expired_date ?? '',
      payment_password: prevData?.payment_password ?? '',
    }));
  };

  useEffect(() => {
    setAddressData([]);
    setSeletedAddress({
      id: '',
      address_name: '',
      name: '',
      address: '',
      zip_code: '',
    });

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
          throw Error();
        }

        const responseData = await userResponse.json();
        if (responseData) setAddressData(responseData);
      } catch (error) {
        console.error(error);
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    postFetchData();
  }, [token]);

  return (
    <div className={'max-w-screen-md mx-auto px-6 py-2'}>
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* 배송 주소 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">배송 주소</h2>
          </div>
          <div className="mt-4">
            <p className="text-ml font-bold">{seletedAddress.address_name}</p>
            <p className="text-sm ">{seletedAddress.name}</p>
            <p className="text-sm text-gray-500">{seletedAddress.address}</p>
            <div
              className={`border my-6 p-6 rounded-lg cursor-pointer flex justify-between items-center ${
                showOptions ? 'border-black' : 'border-gray-300'
              }`}
              onClick={() => setShowOptions(!showOptions)}
            >
              <div>
                <p className="font-bold">주소 선택</p>
              </div>
              <div>
                <span>&gt;</span>
              </div>
            </div>

            {/* 카드 옵션 리스트 */}
            {showOptions &&
              addressData.map((address) => (
                <div className="border mt-2 rounded-lg">
                  <div
                    className={`flex items-center rounded-lg p-4 cursor-pointer border}`}
                    onClick={() => handleAddressChange(address)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="text-sm font-bold mr-2"></div>
                        <div>
                          <p className="font-bold">{address.address_name}</p>
                          <p className="text-sm">{address.name}</p>
                          <p className="text-sm text-gray-500">
                            {address.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="문 앞에 놓아주세요"
              className="w-full border rounded-md p-2 text-sm"
              onChange={handleInstructionChange}
            />
          </div>
        </div>

        {/* 배송 방법 섹션 */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold mb-4">배송 방법</h2>

          <div
            className={`flex items-center p-4 mb-2 border rounded-lg border-black`}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-md flex justify-center items-center mr-4">
              <FontAwesomeIcon icon={faTruck} style={{ color: '#000000' }} />
            </div>
            <div>
              <p className="font-bold">일반배송 3,000원</p>
              <p className="text-sm text-gray-500">
                검사 후 배송 ・ 5-7일 내 도착 예정
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBidAddressComponent;
