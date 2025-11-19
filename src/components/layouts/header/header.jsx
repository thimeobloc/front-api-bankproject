import React from 'react';
import "./header.css"
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    return(
    <header className="header_home">
        <div className="icons">
            <div>
            <img className="logo" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F021%2F944%2F628%2Fnon_2x%2Fbank-logo-or-icon-design-on-white-background-illustration-vector.jpg&f=1&nofb=1&ipt=c79ede7cb03fb488fcb9f65204cf068879e36c82b92697ceec5f2c14e5bfd66a" alt=""></img>
            <a onClick={() => navigate("/")}></a>
            </div>
            <h2>Banque Exemple</h2>
            <div className="menu">
                <nav className="navbar">  
                    <ul>
                        <li><a onClick={() => navigate("/")}>Accueil</a></li>
                        <li><a onClick={() => navigate("/#accounts")}>Comptes</a></li>
                        <li><a onClick={() => navigate("/Deposit")}>Dépôt</a></li>
                        <li><a onClick={() => navigate("/Transfert")}>Transfert</a></li>
                        <li><a onClick={() => navigate("/Login")}>Profil</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    );
}