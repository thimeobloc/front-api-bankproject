import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

/**
 * Header component.
 *
 * Displays the top navigation bar with the bank logo, title, and navigation links.
 * Links differ depending on whether a user is logged in or not.
 *
 * @component
 * @param {Object} props
 * @param {Object|null} props.user - Currently logged-in user or null if not logged in
 * @param {function} props.setUser - Function to update the user state
 */
export default function Header({ user, setUser }) {
    const navigate = useNavigate();

    // Déconnexion : supprime l'utilisateur et le token, puis redirige vers /Login
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/Login");
    };

    // Navigation vers une route donnée
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <header>
            <div className="header-container">
                <div className="logo-container">
                    <button
                        className="logo-button"
                        onClick={() => handleNavigation("/")}
                        aria-label="Retour à l'accueil"
                    >
                        <img
                            className="logo"
                            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F021%2F944%2F628%2Fnon_2x%2Fbank-logo-or-icon-design-on-white-background-illustration-vector.jpg&f=1&nofb=1"
                            alt="Logo"
                        />
                    </button>
                </div>

                <button
                    className="bank-title-button"
                    onClick={() => handleNavigation("/")}
                >
                    BANQU'INNOV
                </button>

                <nav className="menu">
                    <ul>
                        {user ? (
                            <>
                                <li>
                                    <button onClick={() => handleNavigation("/Transfert")}>
                                        Transfert
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Déconnexion</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button onClick={() => handleNavigation("/Login")}>
                                        Se connecter
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation("/Signing")}>
                                        S'inscrire
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

// PropTypes si tu veux les réactiver plus tard
// Header.propTypes = {
//   user: PropTypes.oneOfType([
//     PropTypes.object,
//     PropTypes.oneOf([null]),
//   ]),
//   setUser: PropTypes.func.isRequired,
// };
