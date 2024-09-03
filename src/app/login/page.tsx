'use client';

import React, { useState } from 'react';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsButtonEnabled(newEmail !== '' && password !== '');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsButtonEnabled(email !== '' && newPassword !== '');
  };

  const handleLogin = async () => {
    try {
      const credentials = `${email}:${password}`;
      const base64String = Buffer.from(credentials).toString('base64');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${base64String}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] bg-white">
      <div className="w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black">STOCKTEM</h1>
          <p className="text-sm font-semibold tracking-wide">
            FROM STOCK TO EVERY MARKET
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일 주소
            </label>
            <input
              type="email"
              id="email"
              placeholder="예) stocktem@stocktem.co.kr"
              className="mt-1 block w-full p-2 border-b border-gray-300 text-gray-500 focus:outline-none focus:border-black"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 border-b border-gray-300 focus:outline-none focus:border-black"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <button
              className={`w-full py-2 px-4 text-white ${isButtonEnabled ? 'bg-black' : 'bg-gray-200'} rounded-lg text-center font-bold`}
              disabled={!isButtonEnabled}
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
