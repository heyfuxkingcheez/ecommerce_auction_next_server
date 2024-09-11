import React, { useState } from 'react';
import { ReqCardType, ResCardsType } from './paymentInfo';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface CardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  setPaymentData: React.Dispatch<React.SetStateAction<ResCardsType[]>>;
}
const url = process.env.NEXT_PUBLIC_API_URL;

const CardPopup: React.FC<CardPopupProps> = ({
  isOpen,
  onClose,
  setPaymentData,
}) => {
  const { isLoggedIn, token } = useAuth();
  const [cardData, setCardData] = useState<ReqCardType>({
    number: '',
    expiryYear: '',
    expiryMonth: '',
    birthOrBusinessRegistrationNumber: '',
    passwordTwoDigits: '',
    payment_password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ReqCardType, string>>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (/^\d*$/.test(value)) {
      setCardData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: '', // 입력 중일 때 에러 메시지를 초기화
      }));
    }
  };

  const validate = (): boolean => {
    let valid = true;
    let newErrors: Partial<Record<keyof ReqCardType, string>> = {};

    if (!cardData.number.trim()) {
      newErrors.number = '카드 번호를 입력해주세요.';
      valid = false;
    }
    if (!cardData.expiryYear.trim()) {
      newErrors.expiryYear = '만료 연도를 입력해주세요.';
      valid = false;
    }
    if (!cardData.expiryMonth.trim()) {
      newErrors.expiryMonth = '만료 월을 입력해주세요.';
      valid = false;
    }
    if (!cardData.birthOrBusinessRegistrationNumber.trim()) {
      newErrors.birthOrBusinessRegistrationNumber = '생년월일을 입력해주세요.';
      valid = false;
    }
    if (!cardData.passwordTwoDigits.trim()) {
      newErrors.passwordTwoDigits = '비밀번호 앞 2자리를 입력해주세요.';
      valid = false;
    }
    if (!cardData.payment_password.trim()) {
      newErrors.payment_password = '결제 비밀번호를 입력해주세요.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleFetch = async () => {
    try {
      const postCardResponse = await fetch(`${url}/payments/billing-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${token}`,
        },
        body: JSON.stringify(cardData),
      });

      if (!postCardResponse.ok) {
        throw Error;
      }
    } catch (error) {
      alert('등록 실패');
      console.log(error);
    }
  };

  const handleSave = () => {
    if (validate()) {
      handleFetch();
      setCardData({
        number: '',
        expiryYear: '',
        expiryMonth: '',
        birthOrBusinessRegistrationNumber: '',
        passwordTwoDigits: '',
        payment_password: '',
      });
      onClose();
    }
  };

  const handleClose = () => {
    setCardData({
      number: '',
      expiryYear: '',
      expiryMonth: '',
      birthOrBusinessRegistrationNumber: '',
      passwordTwoDigits: '',
      payment_password: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">새 카드 추가</h3>

        <label className="block text-black-500 text-sm font-medium mb-1">
          카드 번호
          <input
            type="text"
            name="number"
            value={cardData.number}
            onChange={handleInputChange}
            className={`w-full border-b-2 p-2 focus:outline-none ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="카드 번호를 입력하세요"
          />
          {errors.number && (
            <p className="text-red-500 text-sm mt-1">{errors.number}</p>
          )}
        </label>

        <div className="flex justify-between">
          <label className="block text-black-500 text-sm font-medium mb-1 w-1/2">
            만료 월
            <input
              type="text"
              name="expiryMonth"
              value={cardData.expiryMonth}
              onChange={handleInputChange}
              className={`w-full border-b-2 p-2 focus:outline-none ${
                errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="MM"
            />
            {errors.expiryMonth && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
            )}
          </label>

          <label className="block text-black-500 text-sm font-medium mb-1 w-1/2">
            만료 연도
            <input
              type="text"
              name="expiryYear"
              value={cardData.expiryYear}
              onChange={handleInputChange}
              className={`w-full border-b-2 p-2 focus:outline-none ${
                errors.expiryYear ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="YY"
            />
            {errors.expiryYear && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
            )}
          </label>
        </div>

        <label className="block text-black-500 text-sm font-medium mb-1">
          생년월일
          <input
            type="number"
            name="birthOrBusinessRegistrationNumber"
            value={cardData.birthOrBusinessRegistrationNumber}
            onChange={handleInputChange}
            className={`w-full border-b-2 p-2 focus:outline-none ${
              errors.birthOrBusinessRegistrationNumber
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="생년월일(6자리)"
          />
          {errors.birthOrBusinessRegistrationNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.birthOrBusinessRegistrationNumber}
            </p>
          )}
        </label>
        <label className="block text-black-500 text-sm font-medium mb-1">
          카드 비밀번호 (앞 2자리)
          <input
            type="password"
            name="passwordTwoDigits"
            value={cardData.passwordTwoDigits}
            onChange={handleInputChange}
            className={`w-full border-b-2 p-2 focus:outline-none ${
              errors.passwordTwoDigits ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="비밀번호 앞 2자리"
            pattern="\d*"
            maxLength={2}
          />
          {errors.passwordTwoDigits && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passwordTwoDigits}
            </p>
          )}
        </label>

        <label className="block text-black-500 text-sm font-medium mb-1">
          결제 비밀번호
          <input
            type="password"
            name="payment_password"
            value={cardData.payment_password}
            onChange={handleInputChange}
            className={`w-full border-b-2 p-2 focus:outline-none ${
              errors.payment_password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="결제 비밀번호"
            pattern="\d*"
            maxLength={6}
          />
          {errors.payment_password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.payment_password}
            </p>
          )}
        </label>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white rounded px-4 py-2 hover:bg-gray-600"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPopup;
