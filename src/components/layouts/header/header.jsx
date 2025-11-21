import React, { useEffect, useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/Login");
        window.location.reload();
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <header>
            <div className="header-container">
                <div className="logo-container">
                    <img
                        className="logo"
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F021%2F944%2F628%2Fnon_2x%2Fbank-logo-or-icon-design-on-white-background-illustration-vector.jpg&f=1&nofb=1"
                        alt="Logo"
                        onClick={() => handleNavigation("/")}
                        style={{ cursor: "pointer" }}
                    />
                </div>

                <button
                    className="bank-title-button"
                    onClick={() => handleNavigation("/")}
                >
                    BANQU'INNOV
                </button>

                <nav className="menu">
                    <ul>
                        {!user ? (
                            <>
                                <li><a onClick={() => handleNavigation("/Login")}>Se connecter</a></li>
                                <li><a onClick={() => handleNavigation("/Signing")}>S'inscrire</a></li>
                            </>
                        ) : (
                            <>
                                <li><a onClick={() => handleNavigation("/Transfert")}>Transfert</a></li>
                                <li><a onClick={handleLogout}>Déconnexion</a></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
