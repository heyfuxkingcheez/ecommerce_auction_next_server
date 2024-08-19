import React, { useState } from 'react';

export default function Account() {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const handleChange = () => {
    // 변경하기 버튼 클릭 시 처리 로직 추가
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

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">정산 계좌 변경</h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold">등록된 계좌 정보</span>
        </p>
        <p>카카오뱅크 3333097013111 / 정기욱</p>
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
            className="mt-1 block w-full p-2 border-b border-gray-300 focus:outline-none focus:border-black"
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
            className="mt-1 block w-full p-2 border-b border-gray-300 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <button
        onClick={handleChange}
        className={`mt-6 w-full py-3 text-white rounded-lg ${
          bankName && accountNumber && accountHolder
            ? 'bg-black'
            : 'bg-gray-200'
        }`}
        disabled={!bankName || !accountNumber || !accountHolder}
      >
        변경하기
      </button>
    </div>
  );
}
