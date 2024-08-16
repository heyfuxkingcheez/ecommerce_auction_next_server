import React, { useState } from 'react';

export default function ProfileManage() {
  const [nickname, setNickname] = useState('닉네임');
  const [phone, setPhone] = useState('+821081881282');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [errors, setErrors] = useState({
    nickname: '',
    phone: '',
    password: '',
  });

  const validateNickname = (name: string) => {
    if (name.length < 1 || name.length > 20) {
      return '닉네임은 1글자 이상 20글자 이하여야 합니다.';
    }
    return '';
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+82\d{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return '휴대폰 번호는 +821000000000 형식이어야 합니다.';
    }
    return '';
  };

  const validatePassword = () => {
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
      setIsEditingNickname(false);
      setErrors((prev) => ({ ...prev, nickname: '' }));
    }
  };

  const handleSavePhone = () => {
    const error = validatePhone(phone);
    if (error) {
      setErrors((prev) => ({ ...prev, phone: error }));
    } else {
      setIsEditingPhone(false);
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleSavePassword = () => {
    const error = validatePassword();
    if (error) {
      setErrors((prev) => ({ ...prev, password: error }));
    } else {
      setIsEditingPassword(false);
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="p-8 rounded-lg flex flex-col space-y-8">
      {/* 상단 프로필 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          {/* 프로필 이미지 */}
          <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
          {/* 닉네임 및 버튼 */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{nickname}</h2>
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
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="border-none w-full focus:outline-none"
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
              </>
            ) : (
              <>
                <span className="flex-1">{nickname}</span>
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-none w-full focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                <button
                  onClick={handleSavePhone}
                  className="px-4 py-2 bg-gray-200 rounded-full text-black-500"
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{phone}</span>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-none w-full focus:outline-none"
                    placeholder="새 비밀번호"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
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
