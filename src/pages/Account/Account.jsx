import React from 'react';
import Details from '../../../src/components/account/DetailsAccountSpec';
import Transaction from '../../../src/components/account/TransactionAccountSpec';

import "../../../src/pages/Beneficiary/Beneficiary.css"
import './Account.css';

export default function Account() {
  return (
    <section>
        <div className="body">
            <Details/>
            <Transaction />
        </div>
    </section>
  );
}

