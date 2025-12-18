import React from 'react';
import liageImage from './../images/logotransfert.png';

/**
 * Card component displaying a beneficiary's information.
 *
 * Shows the beneficiary's name, IBAN, and a logo image.
 * The card is clickable and triggers a callback when clicked.
 *
 * @component
 * @param {Object} props
 * @param {string} props.name - Beneficiary's name
 * @param {string} props.iban - Beneficiary's IBAN
 * @param {string} [props.imgUrl] - Optional URL for a custom image (default logo is used if not provided)
 * @param {function} props.onClick - Function called when the card is clicked
 */
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

BeneficiaryCard.propTypes = {
  name: PropTypes.string.isRequired,
  iban: PropTypes.string.isRequired,
  imgUrl: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
