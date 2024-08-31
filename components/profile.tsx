import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  nickname: string;
  email: string;
  phone_number: string;
  role: string;
  image: string;
}

export default function ProfileManage() {
  const { isLoggedIn, token } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const [nickname, setNickname] = useState('');
  const [phone_number, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [errors, setErrors] = useState({
    nickname: '',
    phone_number: '',
    password: '',
  });

  const validateNickname = (name: string) => {
    if (name.length < 1 || name.length > 20) {
      return '닉네임은 1글자 이상 20글자 이하여야 합니다.';
    }
    return '';
  };

  const validatePhone = (phone_number: string) => {
    const phoneRegex = /^\+82\d{10,11}$/;
    if (!phoneRegex.test(phone_number)) {
      return '휴대폰 번호는 +821000000000 형식이어야 합니다.';
    }
    return '';
  };

  const validatePassword = () => {
    if (password.length < 8 || password.length > 20) {
      return '비밀번호는 8자 이상 20자 이하여야 합니다.';
    }
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const handleSaveNickname = () => {
    const error = validateNickname(nickname);
    if (error) {
      setErrors((prev) => ({ ...prev, nickname: error }));
    } else {
      handlePatchUserData({ nickname });
      setIsEditingNickname(false);
      setErrors((prev) => ({ ...prev, nickname: '' }));
    }
  };

  const handleSavePhone = () => {
    const error = validatePhone(phone_number);
    if (error) {
      setErrors((prev) => ({ ...prev, phone_number: error }));
    } else {
      handlePatchUserData({ phone_number });
      setIsEditingPhone(false);
      setErrors((prev) => ({ ...prev, phone_number: '' }));
    }
  };

  const handleSavePassword = () => {
    const error = validatePassword();

    if (error) {
      setErrors((prev) => ({ ...prev, password: error }));
    } else {
      handlePatchUserData({ password });
      setIsEditingPassword(false);
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  async function handlePatchUserData(data: {
    nickname?: string;
    phone_number?: string;
    password?: string;
  }) {
    try {
      const userPatchResponse = await fetch(
        'http://localhost:3000/api/users/me',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      const response = await userPatchResponse.json();

      if (!userPatchResponse.ok) {
        throw new Error(response.error);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('http://localhost:3000/api/users/me', {
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

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        throw new Error('유저 정보 불러오기 실패');
      }
    }

    if (token && isLoggedIn !== false) {
      fetchData();
    }
  }, [isLoggedIn]);

  return (
    <div className="p-8 rounded-lg flex flex-col space-y-8">
      {/* 상단 프로필 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          {/* 프로필 이미지 */}
          <img
            src={`http://localhost:3000${user && user.image}`}
            className="w-32 h-32 bg-gray-300 rounded-lg"
          ></img>
          {/* 닉네임 및 버튼 */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{user && user.nickname}</h2>
            <div className="mt-4 flex space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded-full">
                이미지 변경
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded-full">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 프로필 정보 변경 섹션 */}
      <div>
        <h3 className="text-xl font-bold mb-4">프로필 정보</h3>
        <div className="space-y-4">
          {/* 닉네임 변경 */}
          <div className=" flex justify-between items-center border-b border-gray-300 pb-2">
            {isEditingNickname ? (
              <>
                <div className="flex-1">
                  <input
                    type="text"
                    onChange={(e) => setNickname(e.target.value)}
                    className="border-none w-full focus:outline-none"
                    placeholder="닉네임은 1~20글자를 입력해주세요."
                  />
                  {errors.nickname && (
                    <p className="text-red-500 text-sm">{errors.nickname}</p>
                  )}
                </div>
                <button
                  onClick={handleSaveNickname}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingNickname(false)}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{user && user.nickname}</span>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  변경
                </button>
              </>
            )}
          </div>
          {/* 휴대폰 변경 */}
          <div className=" flex justify-between items-center border-b border-gray-300 pb-2">
            {isEditingPhone ? (
              <>
                <div className="flex-1">
                  <input
                    type="text"
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-none w-full focus:outline-none"
                    placeholder="+8210 형식을 맞춰 주세요"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSavePhone}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingPhone(false)}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{user && user.phone_number}</span>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  변경
                </button>
              </>
            )}
          </div>
          {/* 비밀번호 변경 */}
          <div className=" flex justify-between items-center border-b border-gray-300 pb-2">
            {isEditingPassword ? (
              <>
                <div className="flex-1 space-y-2">
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-none w-full focus:outline-none"
                    placeholder="새 비밀번호"
                  />
                  <input
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-none w-full focus:outline-none"
                    placeholder="비밀번호 확인"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                <button
                  onClick={handleSavePassword}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingPassword(false)}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">비밀번호</span>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  변경
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
