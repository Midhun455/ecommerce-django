import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUsername = localStorage.getItem("username");
        const savedIsAdmin = localStorage.getItem("is_admin") === "true"; // stored as string

        if (token) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
            setIsAdmin(savedIsAdmin);
        } else {
            setIsAuthenticated(false);
            setUsername(null);
            setIsAdmin(false);
        }
    }, []);

    const login = (token, refresh, user, is_admin) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("username", user);
        localStorage.setItem("is_admin", is_admin);

        setIsAuthenticated(true);
        setUsername(user);
        setIsAdmin(is_admin);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        localStorage.removeItem("is_admin");

        setIsAuthenticated(false);
        setUsername(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, username, isAdmin, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
