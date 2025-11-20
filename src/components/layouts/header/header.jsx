import React, { useEffect, useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Log de récupération du user depuis localStorage
    useEffect(() => {
        console.log("[Header] Récupération du user depuis localStorage...");
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            console.log("[Header] User récupéré :", parsedUser);
        } else {
            console.log("[Header] Aucun user trouvé dans localStorage");
        }
    }, []);

    const handleLogout = () => {
        console.log("[Header] Déconnexion en cours...");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        console.log("[Header] localStorage vidé, navigation vers /Login");
        navigate("/Login");
        window.location.reload();
    };

    const handleNavigation = (path) => {
        console.log(`[Header] Navigation vers ${path}`);
        navigate(path);
    };

    return (
        <header>
            <div className="icons">
                <div>
                    <img
                        className="logo"
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F021%2F944%2F628%2Fnon_2x%2Fbank-logo-or-icon-design-on-white-background-illustration-vector.jpg&f=1&nofb=1"
                        alt="Logo"
                    />
                </div>

                <h2>Banque Exemple</h2>

                <div className="menu">
                    <nav className="navbar">
                        <ul>
                            {!user ? (
                                <>
                                    <li><a onClick={() => handleNavigation("/")}>Accueil</a></li>
                                    <li><a onClick={() => handleNavigation("/Login")}>Se connecter</a></li>
                                    <li><a onClick={() => handleNavigation("/Signing")}>S'inscrire</a></li>
                                </>
                            ) : (
                                <>
                                    <li>Connecté en tant que : <b>{user.name}</b></li>
                                    <li><a onClick={() => handleNavigation("/")}>Accueil</a></li>
                                    <li><a onClick={() => handleNavigation("/Deposit")}>Dépôt</a></li>
                                    <li><a onClick={() => handleNavigation("/Transfert")}>Transfert</a></li>
                                    <li><a onClick={handleLogout}>Déconnexion</a></li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
