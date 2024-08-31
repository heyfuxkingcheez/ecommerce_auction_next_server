'use client';

import { BidDataType } from '@/app/purchase/[id]/page';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResCardsType } from './paymentInfo';
import { url } from './addressBook';

export interface PurchaseBidPaymentComponentProps {
  setPurchaseBidData: React.Dispatch<React.SetStateAction<BidDataType | null>>;
}

const PurchaseBidPaymentComponent: React.FC<
  PurchaseBidPaymentComponentProps
> = ({ setPurchaseBidData }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    id: '',
    name: '결제 카드 선택',
    number: '',
  });
  const [showOptions, setShowOptions] = useState(false);
  const [paymentData, setPaymentData] = useState<ResCardsType[]>([]);
  const { token } = useAuth();

  const handlePaymentMethodChange = (payment: ResCardsType) => {
    setSelectedPaymentMethod(payment);
    setShowOptions(false); // 옵션 선택 후 리스트를 닫습니다.
    setPurchaseBidData((prevData) => ({
      ...prevData,
      itemOptionId: prevData?.itemOptionId ?? '',
      price: prevData?.price ?? 0,
      addressId: prevData?.addressId ?? '',
      paymentId: payment?.id ?? '',
      delivery_instruction: prevData?.delivery_instruction ?? '',
      expired_date: prevData?.expired_date ?? '',
      payment_password: prevData?.payment_password ?? '',
    }));
  };

  const handlePaymentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPurchaseBidData((prevData) => ({
      ...prevData,
      itemOptionId: prevData?.itemOptionId ?? '',
      price: prevData?.price ?? 0,
      addressId: prevData?.addressId ?? '',
      paymentId: prevData?.paymentId ?? '',
      delivery_instruction: prevData?.delivery_instruction ?? '',
      expired_date: prevData?.expired_date ?? '',
      payment_password: e.target.value ?? '',
    }));
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
      } catch (error) {
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    getFetchData();
  }, [token]);

  return (
    <div className="max-w-screen-md mx-auto px-6 py-2">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* 결제 방법 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">결제 방법</h2>
          </div>

          {/* 기본 결제 카드 선택 */}
          <div
            className={`border p-6 rounded-lg cursor-pointer flex justify-between items-center ${
              showOptions ? 'border-black' : 'border-gray-300'
            }`}
            onClick={() => setShowOptions(!showOptions)}
          >
            <div className="flex items-center">
              <div className="text-sm font-bold mr-2">
                {selectedPaymentMethod.name}
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {selectedPaymentMethod.number}
                </p>
              </div>
            </div>
            <div>
              <span>&gt;</span>
            </div>
          </div>

          {/* 카드 옵션 리스트 */}
          {showOptions &&
            paymentData.map((payment) => (
              <div className="border mt-2 rounded-lg">
                <div
                  className={`flex items-center rounded-lg p-4 cursor-pointer border}`}
                  onClick={() => handlePaymentMethodChange(payment)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2">
                        {payment.name}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {payment.number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className="mt-4">
            <h2 className="text-ml font-bold my-2">결제 비밀번호</h2>
            <input
              type="password"
              className="w-full border rounded-md p-2 text-sm "
              onChange={handlePaymentPasswordChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBidPaymentComponent;
