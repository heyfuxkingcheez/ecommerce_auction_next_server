import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CardPopup from './paymentPostPopup';

const url = process.env.NEXT_PUBLIC_API_URL;

export interface ReqCardType {
  number: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrBusinessRegistrationNumber: string;
  passwordTwoDigits: string;
  payment_password: string;
}

export interface ResCardsType {
  id: string;
  name: string;
  number: string;
}

export default function PaymentInfo() {
  const { isLoggedIn, token } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<ResCardsType[]>([]);

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    async function getFetchData() {
      try {
        const userResponse = await fetch(`${url}/payments/billing-key`, {
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

        const userPaymentsData = await userResponse.json();
        if (userPaymentsData) setPaymentData(userPaymentsData);
        console.log(userPaymentsData);
      } catch (error) {
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    if (token && isLoggedIn !== false) {
      getFetchData();
    }
  }, [token, isLoggedIn]);

  async function deleteFetchData(billingKey: string) {
    try {
      const userResponse = await fetch(
        `${url}/payments/billing-key/${billingKey}`,
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

      setPaymentData((pre) =>
        pre.filter((payment) => payment.id !== billingKey),
      );
    } catch (error) {
      throw new Error('삭제 실패');
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">결제 정보</h2>
          <p className="text-sm text-gray-500">
            수수료(페널티, 착불배송비 등)가 정산되지 않을 경우, 별도 고지 없이
            해당 금액을 결제 시도할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handlePopupOpen}
          className="border border-gray-400 rounded-full px-4 py-2 text-sm"
        >
          + 새 카드 추가하기
        </button>
      </div>

      {paymentData.map((method) => (
        <div key={method.id} className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center border border-gray-400 rounded-lg">
                {method.name}
              </div>
              <div className="ml-4">
                <div className="text-lg font-semibold">
                  {method.number.slice(0, 4) + '****' + method.number.slice(-4)}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteFetchData(method.id)}
                className="border border-gray-400 rounded-full px-4 py-2 text-sm"
              >
                삭제
              </button>
            </div>
          </div>
          {/* {method.id < paymentMethods.length && <hr className="my-4" />} */}
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <button className="px-4 py-2 border border-gray-400 rounded-full text-sm">
          1
        </button>
      </div>
      {/* 카드 추가 팝업 */}
      <CardPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        setPaymentData={setPaymentData}
      />
    </div>
  );
}
