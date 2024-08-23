// app/purchase/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';

import PurchaseBidAddressComponent from '../../../../components/purchaseBidAddress';
import PurchaseBidPaymentComponent from '../../../../components/purchaseBidPayment';
import PurchaseBidContinueComponent from '../../../../components/purchaseBidContinue';
import PurchaseBidItemComponent from '../../../../components/purchaseBidItem';
import PurchaseBidConfirmComponent from '../../../../components/purchaseBidConfirm';

export type BidDataType = {
  addressId: string;
  paymentId: string;
  itemOptionId: string;
  delivery_instruction: string;
  expired_date: string;
  price: number;
  payment_password: string;
};

const PurchasePage = ({ params }: { params: { id: string } }) => {
  const [isBidSubmitted, setIsBidSubmitted] = useState(false);
  const [purchaseBidData, setPurchaseBidData] = useState<BidDataType | null>(
    null,
  );

  const handleBidSubmit = () => {
    setIsBidSubmitted(true);
  };

  useEffect(() => {}, [purchaseBidData]);
  return (
    <div>
      <PurchaseBidItemComponent
        params={params}
        setPurchaseBidData={setPurchaseBidData}
      />
      {!isBidSubmitted ? (
        <div>
          <PurchaseBidContinueComponent
            params={params}
            onSubmit={handleBidSubmit}
            setPurchaseBidData={setPurchaseBidData}
          />
        </div>
      ) : (
        <div>
          <PurchaseBidAddressComponent
            setPurchaseBidData={setPurchaseBidData}
          />
          <PurchaseBidPaymentComponent
            setPurchaseBidData={setPurchaseBidData}
          />
          <PurchaseBidConfirmComponent purchaseBidData={purchaseBidData} />
        </div>
      )}
    </div>
  );
};

export default PurchasePage;
