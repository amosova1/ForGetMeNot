import React, { useEffect, useState } from "react";
import { Login } from '../modal/login.tsx';
import { Register } from '../modal/register.tsx';
import {useNavigate} from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [username, setUsername] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });
    const navigate = useNavigate();

    // useEffect(() => {
    //     const savedUsername = localStorage.getItem("username");
    //     if (savedUsername) {
    //         setUsername(savedUsername);
    //         setIsLoggedIn(true);
    //     }
    //
    //     const savedIsAdmin = localStorage.getItem("isAdmin");
    //     if (savedIsAdmin === "true") setIsAdmin(true);
    // }, []);

    useEffect(() => {
        fetch('/api/login', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    handleSetUsername(data.username, data.isAdmin);
                }
            });
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const handleSetUsername = (name: string, admin: boolean) => {
        setUsername(name);
        setIsAdmin(admin);
        setIsLoggedIn(true);

        if (admin) {
            navigate("/admin")
        } else {
            navigate("/content");
        }
    };

    const handleLogout = () => {
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            setIsLoggedIn(false);
            setUsername('');
            setIsAdmin(false);
        });
    };

    return (
        <div>
            <header>
                <nav className="flex justify-between m-3 items-center">
                    <div className="flex gap-2">
                        <button className="btn" onClick={() => navigate("/")}>Domov</button>
                        <button className="btn" onClick={() => navigate("/about")}>O nás</button>
                        {isLoggedIn && !isAdmin && (
                            <button className="btn" onClick={() => navigate("/content")}>Moje</button>
                        )}
                        {isLoggedIn && isAdmin && (
                            <button className="btn" onClick={() => navigate("/admin")}>Admin</button>
                        )}
                    </div>

                    <button
                        className="p-2 rounded-md border dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                        {isDarkMode ? "🌞 Light" : "🌙 Dark"}
                    </button>

                    <div className="flex items-center gap-2">
                        {!isLoggedIn ? (
                            <>
                                <button className="btn" onClick={() => setShowLoginModal(true)}>Prihlásenie</button>
                                <button className="btn" onClick={() => setShowRegisterModal(true)}>Registrácia</button>
                            </>
                        ) : (
                            <>
                                <span className="m-2">Ahoj {username}!</span>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        handleLogout()
                                        navigate("/")
                                    }}
                                >
                                    Odhlásenie
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {showLoginModal && (
                <Login
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    setIsLoggedIn={setIsLoggedIn}
                    setUsername={handleSetUsername}
                />
            )}

            {showRegisterModal && (
                <Register
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                    setIsLoggedIn={setIsLoggedIn}
                    setUsername={handleSetUsername}
                />
            )}

            <main className="p-4">{children}</main>

            <footer className="text-center py-4">© 2025</footer>
        </div>
    );
}
