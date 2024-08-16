import React from 'react';

export default function Main() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 배너 */}
      <div className="bg-gray-300 h-96 flex items-center justify-center">
        <h1 className="text-5xl font-bold">배너</h1>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="flex justify-center mt-4">
        <div className="w-3 h-3 bg-black rounded-full mx-1"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full mx-1"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full mx-1"></div>
      </div>

      {/* 그리드 항목들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 max-w-screen-lg mx-auto">
        {[
          { title: '쿠폰 드로우', subtitle: '쿠폰 드로우' },
          { title: '랭킹', subtitle: '랭킹' },
          { title: '신발', subtitle: '신발' },
          { title: '정가 아래', subtitle: '정가 아래' },
          { title: '모자', subtitle: '모자' },
          { title: '샌들', subtitle: '샌들' },
          { title: '상의', subtitle: '상의' },
          { title: '하의', subtitle: '하의' },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-gray-200 rounded-lg flex items-center justify-center w-full h-40">
              {/* 이곳에 이미지나 아이콘을 추가할 수 있습니다. */}
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Most Popular 섹션 */}
      <div className="max-w-screen-lg mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Most Popular</h2>
        <p className="text-gray-500 mb-8">인기 상품</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: '이름', description: '상품 설명', price: '300,000원' },
            { name: '이름', description: '상품 설명', price: '300,000원' },
            { name: '이름', description: '상품 설명', price: '300,000원' },
            { name: '이름', description: '상품 설명', price: '300,000원' },
          ].map((product, index) => (
            <div
              key={index}
              className="rounded-lg p-4 flex flex-col items-center"
            >
              <div className="bg-gray-200 rounded-lg w-full h-40 mb-4"></div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-500">{product.description}</p>
              <p className="font-bold text-lg mt-2">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
