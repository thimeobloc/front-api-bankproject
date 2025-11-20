import React, {useEffect, useState} from 'react';
import BeneficiaryCard from "../../components/beneficiary/BeneficiaryCard.jsx";
import BeneficiaryModal from "../../components/beneficiary/benificiaryModal.jsx";
import "../../pages/Beneficiary/Beneficiary.css"
import Cookies from "js-cookie";
import axios from "axios";
import SearchBar from "../../components/beneficiary/SearchBar.jsx";

export default function Transfert() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    const [account, setAccounts] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));

        if (!token) return;

        axios.get("http://127.0.0.1:8000/accounts/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setAccounts(res.data);

                // Compte principal
                const mainAccount = res.data.find((b) => b.main);
                if (mainAccount) {
                    axios.get(`http://127.0.0.1:8000/accounts/${mainAccount.id}/beneficiaries`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then((res2) => setBeneficiaries(res2.data))
                        .catch((err) => console.error("Erreur bénéficiaires :", err));
                }
            })
            .catch((err) => console.error("Erreur de chargement des comptes :", err));
    }, [token]);

    if (!user) {
        return (
            <div className="welcome-section">
                <h1>Bienvenue sur Votre Banque</h1>
                <p>Connectez-vous pour accéder à vos comptes ou créez un compte.</p>
            </div>
        );
    }
    const appearSecond = () => {
        const to =Array.from(document.getElementsByClassName("to"))
            .map(el => el.id);
        setIsSecondOpen(to);
    }
    const openPopup = () => { setIsPopupOpen(true);};
    const closePopup = () => { setIsPopupOpen(false);};
    const main_account = account.find((b) => b.main);
    const current_account = main_account ? main_account.id : null;

    const filteredBeneficiaries = beneficiairies.filter((b) =>
        b.inputName.toLowerCase().includes(query.toLowerCase())
    );
    return(
        <section>
            <div className="center">
                <SearchBar query={query} setQuery={setQuery} />
                <div className="from" style={{ display: isSecondOpen ? "none" : "block" }}>
                    <div className="list">
                        <h2>Depuis ...</h2>
                        {account.map((b) => (
                            <BeneficiaryCard  onClick={() => appearSecond()}
                                key={b.id}
                                name={b.type}
                                iban={b.rib}
                                imgUrl={b.img}
                            >
                            </BeneficiaryCard>
                        ))}
                    </div>
                </div>
                <div className={"to"} id="to" style={{ display: isSecondOpen ? "block" : "none" }}>
                    <div className="list">
                        { filteredBeneficiaries.length === 0 || !query ?(
                            <>
                                <h2>Vers ...</h2>
                                <h3>Vos comptes</h3>
                                {account.map((b) => (
                                    <BeneficiaryCard
                                        key={b.id}
                                        name={b.type}
                                        iban={b.rib}
                                        imgUrl={b.img}
                                    />
                                ))}
                                <h3>Vos Bénéficiaires</h3>
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
            </div>
            <button className ="fixed_button" onClick={openPopup}>Ajouter un IBAN</button>
            <BeneficiaryModal
                isOpen={isPopupOpen}
                onClose={closePopup}
                accountId={current_account}
                title="Ajouter un Bénéficiaire"
            />
        </section>
    )
}