import React, { Suspense } from 'react';
import { Shop } from '../../../components/shop';

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-3/4 mx-auto">
        <Shop />
      </div>
    </Suspense>
  );
}
