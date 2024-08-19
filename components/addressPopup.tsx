import React, { useEffect, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useAuth } from '../context/AuthContext';
import { AddressType } from './addressBook';

interface AddressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  setAddressData: React.Dispatch<React.SetStateAction<AddressType[]>>;
}

const url = process.env.NEXT_PUBLIC_API_URL;

export default function AddressPopup({
  isOpen,
  onClose,
  setAddressData,
}: AddressPopupProps) {
  const { token } = useAuth();
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [addressName, setAddressName] = useState<string>('');
  const [addressNameError, setAddressNameError] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [detailedAddress, setDetailedAddress] = useState<string>('');

  const scriptUrl =
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(scriptUrl);

  const validateName = () => {
    if (name.trim() === '') {
      setNameError('이름을 입력해주세요.');
    } else {
      setNameError('');
    }
  };

  const validateAddressName = () => {
    if (addressName.trim() === '') {
      setAddressNameError('주소명을 입력해주세요.');
    } else {
      setAddressNameError('');
    }
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setPostalCode(data.zonecode);
    setAddress(fullAddress);
    setDetailedAddress(''); // 초기화
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    validateName();
    validateAddressName();

    if (nameError) {
      return;
    }
    if (addressNameError) {
      return;
    }

    onClose();
  };

  const handlePostUserAddress = async (data: {
    address_name: string;
    name: string;
    zip_code: string;
    address: string;
  }) => {
    if (!addressName && !name && !postalCode && !detailedAddress) {
      return alert('모두 작성하셔야 저장 가능합니다.');
    }

    try {
      const postAddressResponse = await fetch(`${url}/users/address_books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${token}`,
        },
        body: JSON.stringify(data),
      });

      const response = await postAddressResponse.json();

      if (!postAddressResponse.ok) {
        throw new Error(response.error);
      }

      setAddressName('');
      setName('');
      setPostalCode('');
      setAddress('');
      setDetailedAddress('');
      setAddressData((pre) => [...pre, response]);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">새 주소 추가</h2>
              <button type="button" className="text-gray-500" onClick={onClose}>
                &times;
              </button>
            </div>
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-black-500 text-sm font-medium mb-1"
                >
                  주소명
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black ${
                    addressNameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  onBlur={validateAddressName}
                  placeholder="올바른 이름을 입력해주세요. (2 - 50자)"
                />
                {addressNameError && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressNameError}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-black-500 text-sm font-medium mb-1"
                >
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black ${
                    nameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={validateName}
                  placeholder="올바른 이름을 입력해주세요. (2 - 50자)"
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postal-code"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  우편번호
                </label>
                <div className="flex">
                  <input
                    id="postal-code"
                    type="text"
                    className="w-3/4 border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black"
                    placeholder="우편 번호를 검색하세요"
                    value={postalCode}
                    readOnly
                  />
                  <button
                    type="button"
                    className="w-1/4 bg-gray-200 border border-l-0 rounded-r p-1 text-sm text-gray-700 hover:bg-gray-300"
                    onClick={handleClick}
                  >
                    우편번호
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  주소
                </label>
                <input
                  id="address"
                  type="text"
                  className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black"
                  placeholder="우편 번호 검색 후, 자동입력 됩니다"
                  value={address}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="detailed-address"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  상세 주소
                </label>
                <input
                  id="detailed-address"
                  type="text"
                  className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black"
                  placeholder="건물, 아파트, 동/호수 입력"
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 rounded px-4 py-2 mr-2 hover:bg-gray-300"
                  onClick={onClose}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-black text-white rounded px-4 py-2 hover:bg-gray-600"
                  onClick={() =>
                    handlePostUserAddress({
                      address_name: addressName,
                      name,
                      zip_code: postalCode,
                      address: address + detailedAddress,
                    })
                  }
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
