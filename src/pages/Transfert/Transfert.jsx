import React, {useEffect, useState} from 'react';
import BeneficiaryCard from "../../components/beneficiary/BeneficiaryCard.jsx";
import "../../pages/Beneficiary/Beneficiary.css"
import Cookies from "js-cookie";
import axios from "axios";
import SearchBar from "../../components/beneficiary/SearchBar.jsx";

export default function Transfert() {
    /***const [isPopupOpen, setIsPopupOpen] = useState(false);**/
    const [isSecondOpen, setIsSecondOpen] = useState(false);

    const beneficiairies = [
        { id: 1, inputName: "Alice Dupont", iban: "FR76 1000 2000 3000 400167890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 2, inputName: "Jean Martin", iban: "FR76 1000 2000 3000 400267890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 3, inputName: "Sophie Bernard", iban: "FR76 1000 2000 3000 400367890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 4, inputName: "Lucas Leroy", iban: "FR76 1000 2000 3000 400467890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 5, inputName: "Chloé Moreau", iban: "FR76 1000 2000 3000 400567890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 6, inputName: "Hugo Lefevre", iban: "FR76 1000 2000 3000 400667890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 7, inputName: "Emma Dubois", iban: "FR76 1000 2000 3000 400767890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 8, inputName: "Louis Mercier", iban: "FR76 1000 2000 3000 400867890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa"},
        { id: 9, inputName: "Clara Fontaine", iban: "FR76 1000 2000 3000 400967890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
        { id: 10, inputName: "Maxime Roux", iban: "FR76 1000 2000 3000 401067890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" }
    ];
    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    const [account, setAccounts] = useState([]);
    const filteredBeneficiaries = beneficiairies.filter((b) =>
        b.inputName.toLowerCase().includes(query.toLowerCase())
    );
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
    const appearSecond = () => {
        const to =Array.from(document.getElementsByClassName("to"))
            .map(el => el.id);
        setIsSecondOpen(to);
    }
    /***const openPopup = () => { setIsPopupOpen(true);};
    const closePopup = () => { setIsPopupOpen(false);};**/
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
                                {console.log(b.beneficiary)}
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
            <button className ="fixed_button">Ajouter un IBAN</button>
        </section>
    )
}