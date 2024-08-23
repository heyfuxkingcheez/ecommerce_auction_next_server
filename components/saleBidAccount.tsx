// pages/index.js
import { saleBidDataType } from '@/app/sale/[id]/page';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { url } from './addressBook';

export interface SaleBidAccountComponentProps {
  setSaleBidData: React.Dispatch<React.SetStateAction<saleBidDataType | null>>;
}

const SaleBidAccountComponent: React.FC<SaleBidAccountComponentProps> = ({
  setSaleBidData,
}) => {
  const { token } = useAuth();
  const [accountData, setAccountData] = useState({
    bank_name: '',
    account_number: '',
    account_holder: '',
  });

  useEffect(() => {
    async function getFetchData() {
      try {
        const userResponse = await fetch(`${url}/settlement-accounts/me`, {
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

        const data = await userResponse.json();
        if (data) {
          setAccountData(data);
          setSaleBidData((prevData) => ({
            ...prevData,
            itemOptionId: prevData?.itemOptionId ?? '',
            addressId: prevData?.addressId ?? '',
            price: prevData?.price ?? 0,
            expired_date: prevData?.expired_date ?? '',
          }));
          console.log('계좌 정보', data);
        }
      } catch (error) {
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    getFetchData();
  }, [token]);
  return (
    <div className="max-w-screen-md mx-auto px-6 py-2">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">판매 정산 계좌</h2>
            <div className="text-sm ">
              <p>
                <span className="text-gray-500">계좌 : </span>{' '}
                {accountData.bank_name}
                {` ${accountData.account_number}`}
              </p>
              <p>
                <span className="text-gray-500">예금주 : </span>{' '}
                {accountData.account_holder}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleBidAccountComponent;
