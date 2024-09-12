'use client';

import React, { useEffect, useState } from 'react';
import { url } from '../../../components/addressBook';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [userData, setUserData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone_number: '',
  });

  const [termsChecked, setTermsChecked] = useState({
    required: false,
    optional: false,
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    handleFormChange(id, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setTermsChecked((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  useEffect(() => {
    handleFormChange();
  }, [termsChecked]);

  const handleFormChange = (id?: string, value?: string) => {
    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = ''; // 비밀번호 확인 에러 필드 추가
    let nicknameError = '';
    let phoneNumberError = '';

    // 이메일 형식 검사
    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value || userData.email)) {
        emailError = '유효한 이메일 주소를 입력하세요.';
      }
    }

    // 비밀번호 8자리 이상 검사
    if (id === 'password') {
      if ((value || userData.password).length < 8) {
        passwordError = '비밀번호는 최소 8자 이상이어야 합니다.';
      }
    }

    // 비밀번호와 비밀번호 확인 필드 일치 여부 검사
    if (id === 'confirmPassword') {
      if (userData.password !== userData.confirmPassword) {
        confirmPasswordError = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
      }
    }

    // 닉네임 공백 금지 검사
    if (id === 'nickname') {
      const nicknameRegex = /^\S*$/; // 공백 포함되지 않음
      if (!nicknameRegex.test(value || userData.nickname)) {
        nicknameError = '닉네임에 공백을 포함할 수 없습니다.';
      }
    }

    // 휴대폰 번호 형식 검사
    if (id === 'phone_number') {
      const phoneRegex = /^010\d{8}$/; // 010으로 시작하고 8자리 숫자
      if (!phoneRegex.test(value || userData.phone_number)) {
        phoneNumberError =
          '유효한 휴대폰 번호를 입력하세요 (010xxxxxxxx 형식).';
      }
    }

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      nickname: nicknameError,
      phone_number: phoneNumberError,
    });

    // 폼 유효성 검사 결과
    const isFormValid =
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !nicknameError &&
      !phoneNumberError &&
      userData.email &&
      userData.password &&
      userData.confirmPassword &&
      userData.nickname &&
      userData.phone_number &&
      termsChecked.required;
    isFormValid ? setIsFormValid(true) : setIsFormValid(false);
  };

  const handleFetch = async () => {
    try {
      const response = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          nickname: userData.nickname,
          password: userData.password,
          phone_number: userData.phone_number,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw Error(result.error);
      }

      router.push('/');
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            이메일 주소*
          </label>
          <input
            id="email"
            type="email"
            placeholder="예) stocktem@stocktem.co.kr"
            value={userData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${
              errors.email ? 'border-red-500' : 'focus:border-blue-500'
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            비밀번호*
          </label>
          <input
            id="password"
            type="password"
            placeholder="영문, 숫자, 특수문자 조합 8-16자"
            value={userData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${
              errors.password ? 'border-red-500' : 'focus:border-blue-500'
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            비밀번호 확인*
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={userData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${
              errors.confirmPassword
                ? 'border-red-500'
                : 'focus:border-blue-500'
            }`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nickname"
          >
            닉네임*
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={userData.nickname}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${
              errors.nickname ? 'border-red-500' : 'focus:border-blue-500'
            }`}
            required
          />
          {errors.nickname && (
            <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone_number"
          >
            휴대폰 번호*
            <span className="mx-2 my-1 mb-1 text-xs text-gray-500">
              ㅡ 는 제외
            </span>
          </label>
          <input
            id="phone_number"
            type="text"
            placeholder="01099999999"
            value={userData.phone_number}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none ${
              errors.phone_number ? 'border-red-500' : 'focus:border-blue-500'
            }`}
            required
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              id="required"
              type="checkbox"
              className="form-checkbox"
              checked={termsChecked.required}
              onChange={handleCheckboxChange}
              required
            />
            <span className="ml-2 text-sm">
              [필수] 만 14세 이상이며 모두 동의합니다.
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              id="optional"
              type="checkbox"
              className="form-checkbox"
              checked={termsChecked.optional}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-sm">
              [선택] 광고성 정보 수신에 모두 동의합니다.
            </span>
          </label>
        </div>
        <button
          type="submit"
          className={`w-full py-2 mt-4 text-white font-bold rounded-lg ${
            isFormValid ? 'bg-black ' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isFormValid}
          onClick={handleFetch}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
