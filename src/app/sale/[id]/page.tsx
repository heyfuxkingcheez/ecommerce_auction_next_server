// app/purchase/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SaleBidItemComponent from '../../../../components/saleBidItem';
import SaleBidAccountComponent from '../../../../components/saleBidAccount';
import SaleBidContinueComponent from '../../../../components/saleBidContinue';
import SaleBidAddressComponent from '../../../../components/saleBidAddress';
import SaleBidConfirmComponent from '../../../../components/saleBidConfirm';

export type saleBidDataType = {
  itemOptionId: string;
  addressId: string;
  expired_date: string;
  price: number;
};

const SalePage = ({ params }: { params: { id: string } }) => {
  const [isBidSubmitted, setIsBidSubmitted] = useState(false);
  const [saleBidData, setSaleBidData] = useState<saleBidDataType | null>(null);

  const handleBidSubmit = () => {
    setIsBidSubmitted(true);
  };

  useEffect(() => {}, [saleBidData]);
  return (
    <div>
      <SaleBidItemComponent params={params} setSaleBidData={setSaleBidData} />
      {!isBidSubmitted ? (
        <div>
          <SaleBidContinueComponent
            params={params}
            onSubmit={handleBidSubmit}
            setSaleBidData={setSaleBidData}
          />
        </div>
      ) : (
        <div>
          {/* 배송 주소 섹션 */}
          <SaleBidAccountComponent setSaleBidData={setSaleBidData} />
          <SaleBidAddressComponent setSaleBidData={setSaleBidData} />
          <SaleBidConfirmComponent saleBidData={saleBidData} />
        </div>
      )}
    </div>
  );
};

export default SalePage;
