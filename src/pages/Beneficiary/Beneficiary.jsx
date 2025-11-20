import React, {useEffect, useState} from 'react';

import "./Beneficiary.css"
import Cookies from "js-cookie";
import axios from "axios";

import BeneficiaryCard from '../../components/beneficiary/BeneficiaryCard.jsx';
import SearchBar from '../../../src/components/beneficiary/SearchBar';

export default function Beneficiary() {



  const [query, setQuery] = useState("");
  const filteredBeneficiaries = beneficiairies.filter((b) =>
    b.inputName.toLowerCase().includes(query.toLowerCase())
  );
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    const [account, setAccounts] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) setUser(JSON.parse(savedUser));

        if (!token) return;

        axios
            .get("http://127.0.0.1:8000/accounts/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setAccounts(res.data);
            })
            .catch((err) => {
                console.error("Erreur de chargement des comptes :", err);
            });
    }, [token]);

    if (!user) {
        return (
            <div className="welcome-section">
                <h1>Bienvenue sur Votre Banque</h1>
                <p>Connectez-vous pour accéder à vos comptes ou créez un compte.</p>
            </div>
        );
    }
  return (
    <section>
      <div className="center">
        <h1>Vers quel bénéficiaire ?</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <div className="list">
          { filteredBeneficiaries.length === 0 || !query ?(
            <>
            <h2>Vos comptes</h2>
            {account.map((b) => (
              <BeneficiaryCard
                key={b.id}
                name={b.inputName}
                iban={b.iban}
                imgUrl={b.img}
              />
            ))}

            <h2>Vos Bénéficiaires</h2>
            {beneficiairies.map((b) => (
              <BeneficiaryCard
                key={b.id}
                name={b.inputName}
                iban={b.iban}
                imgUrl={b.img}
              />
            ))}
            </>
          ) : (
            <>
            <h2>Vous recherchez : "{query}" ...</h2>
            {filteredBeneficiaries.map((b) => (

              <BeneficiaryCard
                key={b.id}
                name={b.inputName}
                iban={b.iban}
                imgUrl={b.img}
              />

            ))}
            </>
          )
          }
        </div>
      </div>
      <button className ="fixed_button">Ajouter un IBAN</button>
    </section>
  );
}
