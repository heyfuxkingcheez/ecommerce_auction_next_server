import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const url = process.env.NEXT_PUBLIC_API_URL;

interface ResAccountType {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export default function Account() {
  const { isLoggedIn, token } = useAuth();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountData, setAccountData] = useState<ResAccountType | null>(null);

  const handleChange = async (method: 'POST' | 'PUT') => {
    try {
      const response = await fetch(`${url}/settlement-accounts/me`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${token}`,
        },
        body: JSON.stringify({
          bank_name: bankName,
          account_holder: accountHolder,
          account_number: accountNumber,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw Error(result.error);
      }

      setAccountData({
        id: result.id,
        bank_name: result.bank_name,
        account_holder: result.account_holder,
        account_number: result.account_number,
      });
      setBankName('');
      setAccountHolder('');
      setAccountNumber('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    // 숫자만 허용
    if (/^\d*$/.test(value)) {
      setAccountNumber(value);
    }
  };

  const handleAccountHolderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    // 한글, 영문자, 공백만 허용
    if (/^[ㄱ-ㅎ가-힣a-zA-Z\s]*$/.test(value)) {
      setAccountHolder(value);
    }
  };

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

        const userAccountData = await userResponse.json();

        if (!userResponse.ok) {
          throw Error(userAccountData.error);
        }

        userAccountData
          ? setAccountData(userAccountData)
          : setAccountData(null);

        return;
      } catch (error) {
        console.error(error);
      }
    }

    if (token && isLoggedIn !== false) {
      getFetchData();
    }
  }, [setAccountData, token, isLoggedIn]);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">정산 계좌 변경</h2>

      <div key={accountData?.id} className="mb-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold">등록된 계좌 정보</span>
        </p>
        <p>
          {accountData
            ? `${accountData.bank_name} ${accountData.account_number} / ${accountData.account_holder}`
            : `등록된 계좌가 없습니다.`}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="bankName"
            className="block text-sm font-medium text-gray-700"
          >
            은행명
          </label>
          <select
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="mt-1 block w-full p-2 border-b border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="" disabled>
              선택하세요
            </option>
            <option value="카카오뱅크">카카오뱅크</option>
            <option value="토스뱅크">토스뱅크</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-gray-700"
          >
            계좌번호
          </label>
          <input
            type="text"
            id="accountNumber"
            placeholder="- 없이 입력하세요"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="accountHolder"
            className="block text-sm font-medium text-gray-700"
          >
            예금주
          </label>
          <input
            type="text"
            id="accountHolder"
            placeholder="예금주명을 정확히 입력하세요."
            value={accountHolder}
            onChange={handleAccountHolderChange}
            className="w-full border-b-2 border-gray-300 p-2 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {accountData ? (
        <button
          onClick={() => handleChange('PUT')}
          className={`mt-6 w-full py-3 text-white rounded-lg ${
            bankName && accountNumber && accountHolder
              ? 'bg-black'
              : 'bg-gray-200'
          }`}
          disabled={!bankName || !accountNumber || !accountHolder}
        >
          변경하기
        </button>
      ) : (
        <button
          onClick={() => handleChange('POST')}
          className={`mt-6 w-full py-3 text-white rounded-lg ${
            bankName && accountNumber && accountHolder
              ? 'bg-black'
              : 'bg-gray-200'
          }`}
          disabled={!bankName || !accountNumber || !accountHolder}
        >
          등록하기
        </button>
      )}
    </div>
  );
}
