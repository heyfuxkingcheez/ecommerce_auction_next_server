import React from 'react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopup = ({
  isOpen,
  onClose,
}: NotificationPopupProps) => {
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
          <div className="flex items-center border-b py-4">
            <img
              src="https://via.placeholder.com/50"
              alt="상품 이미지"
              className="mr-4"
            />
            <div>
              <p className="text-sm">
                Stussy Surfwalk Pigment [L] : 가장 낮은 가격에 바로 구매할 수
                있습니다. (114,200원)
              </p>
              <p className="text-gray-500 text-xs">15시간 전</p>
            </div>
          </div>

          {/* 추가 알림 리스트... */}
        </div>
      </div>
    </div>
  );
};
