import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlarmData {
  message: string;
}

export const NotificationPopup = ({
  isOpen,
  onClose,
}: NotificationPopupProps) => {
  const [isConnectSse, setIsConnectSse] = useState(true);
  const { isLoggedIn, token } = useAuth();
  const [alarmData, setAlarmData] = useState<AlarmData[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      const eventSource = new EventSourcePolyfill(
        `http://localhost:3000/api/sse`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          heartbeatTimeout: 1800000,
        },
      );

      eventSource.onopen = () => {
        setIsConnectSse(true);
        console.log('SSE connection opened');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setAlarmData((prevData) => [...prevData, data]);
          console.log('New message:', data.message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      eventSource.onerror = (error) => {
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect...');
          setIsConnectSse(false);
        }
      };
    }
  }, [isLoggedIn, isConnectSse]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-1/4 h-full p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-bold">알림</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            &times;
          </button>
        </div>

        <div>
          {/* 알림 리스트 예시 */}
          {alarmData &&
            alarmData.map((alarm, index) => (
              <div key={index} className="flex items-center border-b py-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="상품 이미지"
                  className="mr-4"
                />
                <div>
                  <p className="text-sm">{alarm.message}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date().toLocaleDateString()}{' '}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
