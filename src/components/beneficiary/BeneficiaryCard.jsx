import React from 'react';
import liageImage from './../images/logotransfert.png'; 

export default function BeneficiaryCard({ name, iban, imgUrl, onClick }) {
  return (
    <div className="listElement" onClick={onClick} style={{ cursor: "pointer" }}>
      <img src={liageImage} alt="logo of the account" />
      <div className="element">
        <h3>{name}</h3>
        <p>{iban}</p>
      </div>
    </div>
  );
}
