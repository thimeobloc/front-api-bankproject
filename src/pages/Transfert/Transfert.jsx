import React, {useEffect, useState} from 'react';
import BeneficiaryCard from "../../components/beneficiary/BeneficiaryCard.jsx";
import BeneficiaryModal from "../../components/beneficiary/benificiaryModal.jsx";
import TransferModal from "../../components/transfer/TransferModalSpec.jsx";
import "../../pages/Beneficiary/Beneficiary.css"
import Cookies from "js-cookie";
import axios from "axios";
import SearchBar from "../../components/beneficiary/SearchBar.jsx";

export default function Transfert() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpen2, setIsPopupOpen2] = useState(false);

    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    const [account, setAccounts] = useState([]);

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [selectedBeneficiaryRib, setSelectedBeneficiaryRib] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) setUser(JSON.parse(savedUser));

            if (!token) return;

            try {
                const res = await axios.get("http://127.0.0.1:8000/accounts/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAccounts(res.data);

                const mainAccount = res.data.find((b) => b.main);
                if (!mainAccount) return;

                const res2 = await axios.get(`http://127.0.0.1:8000/accounts/beneficiary/${mainAccount.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBeneficiaries(res2.data);
            } catch (err) {
                if (err.response) {
                    console.error("Erreur bénéficiaires, réponse serveur :", err.response.data);
                } else {
                    console.error("Erreur bénéficiaires :", err.message);
                }
            }
        };

        fetchData();
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
        setIsSecondOpen(true);
    }
    const openPopup = () => { setIsPopupOpen(true);};
    const closePopup = () => { setIsPopupOpen(false);};
    const openPopup2 = () => { setIsPopupOpen2(true);};
    const closePopup2 = () => { setIsPopupOpen2(false);};
    const main_account = account.find((b) => b.main);
    const current_account = main_account ? main_account.id : null;

    const filteredBeneficiaries = beneficiaries.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
    );
    return(
        <section>
            <div className="center">
                <SearchBar query={query} setQuery={setQuery} />
                <div className="from" style={{ display: isSecondOpen ? "none" : "block" }}>
                    <div className="list">
                        <h2>Depuis ...</h2>
                        {account.map((b) => (
                            <BeneficiaryCard  
                                name={b.type}
                                iban={b.rib}
                                imgUrl={b.img}
                                onClick={() => {setSelectedAccountId(b.id);  appearSecond(); }}
                            />
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
                                        name={b.type}
                                        iban={b.rib}
                                        imgUrl={b.img}
                                        onClick={() => {setSelectedBeneficiaryRib(b.rib); openPopup2()}}
                                    />
                                ))}

                                <h3>Vos Bénéficiaires</h3>

                                {beneficiaries.length === 0 ? (
                                    <p>Il n'y a pas de bénéficiaire.</p>
                                ) : (
                                    <>
                                        {beneficiaries.map((b) => (
                                            <BeneficiaryCard
                                                name={b.name}
                                                iban={b.rib}
                                                imgUrl={b.img}
                                                onClick={() => {setSelectedBeneficiaryRib(b.rib); openPopup2()}}
                                            />
                                        ))}
                                    </>
                                )}     
                            </>
                        ) : (
                            <>
                                <h2>Vous recherchez : "{query}" ...</h2>
                                {filteredBeneficiaries.map((b) => (
                                    <BeneficiaryCard
                                        name={b.name}
                                        iban={b.rib}
                                        imgUrl={b.img}
                                        onClick={() => {setSelectedBeneficiaryRib(b.rib); openPopup2()}}
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

            <TransferModal
                isOpen={isPopupOpen2}
                onClose={closePopup2}
                accountId={selectedAccountId}
                rib={selectedBeneficiaryRib}
                title={"Faire un nouveau virement"}
            />

        </section>
    )
}