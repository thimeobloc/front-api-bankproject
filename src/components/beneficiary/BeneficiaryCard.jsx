import React from 'react';

export default function BeneficiaryCard({name, iban, imgUrl}) {
  return (
    <div className="listElement">
        <img src={imgUrl} alt="Image of the account" />
        <div className="element">
            <h3>{name}</h3>
            <p>{iban}</p>
         </div>
    </div>
  );
}