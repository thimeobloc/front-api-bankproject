import React from 'react';
import Details from '../../../src/components/account/DetailsAccountSpec';
import Transaction from '../../../src/components/account/TransactionAccountSpec';
import './Account.css';

export default function Account() {
  return (
    <>
      <Details/>
      <Transaction />
    </>
  );
}

