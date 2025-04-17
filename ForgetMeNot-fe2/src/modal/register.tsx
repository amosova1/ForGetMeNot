import React, {useState} from "react";
import {Modal} from './modal.tsx';

const RegisterPage = ({setIsLoggedIn, setUsername, onClose}: {
    setIsLoggedIn: (val: boolean) => void,
    setUsername: (name: string, admin: boolean) => void,
    onClose: () => void;

}) => {
    interface FormData {
        firstname: string;
        lastname: string;
        username: string;
        password: string;

        [key: string]: string;
    }

    interface FormErrors {
        firstname: string;
        lastname: string;
        username: string;
        password: string;

        [key: string]: string;
    }

    const [formData, setFormData] = useState<FormData>({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const registerUser = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Registration successful");
                setIsLoggedIn(true);
                setUsername(result.name, result.admin);
                onClose();
            } else {
                setErrorMessage(result.message || "Registration failed. Please check your inputs.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setErrorMessage("An error occurred. Please try again.");
        }

        setLoading(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors: FormErrors = Object.keys(formData).reduce((errors, name) => {
            if (formData[name] === '') {
                errors[name as keyof FormErrors] = `Pole ${name} je povinné`;
            } else if (name === 'password' && formData[name].length < 6) {
                errors[name as keyof FormErrors] = 'Heslo musí mať aspoň 6 znakov';
            }
            return errors;
        }, {} as FormErrors);

        setFormErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === '')) {
            await registerUser();
        }
    };

    return (
        <div className="register-form">
            <h2>Registrácia</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstname">Meno:</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className={formErrors.firstname ? 'error' : ''}
                    />
                    {formErrors.firstname && <span className="error-message">{formErrors.firstname}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastname">Priezvisko:</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className={formErrors.lastname ? 'error' : ''}
                    />
                    {formErrors.lastname && <span className="error-message">{formErrors.lastname}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="username">Používateľské meno:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={formErrors.username ? 'error' : ''}
                    />
                    {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Heslo:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={formErrors.password ? 'error' : ''}
                    />
                    {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                </div>

                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Registrácia..." : "Registrácia"}
                </button>
            </form>
        </div>
    );
};

export const Register = ({isOpen, onClose, setIsLoggedIn, setUsername}: {
    isOpen: boolean;
    onClose: () => void;
    setIsLoggedIn: (val: boolean) => void;
    setUsername: (name: string, admin: boolean) => void;
}) => {
    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <RegisterPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} onClose={onClose}/>
        </Modal>
    );
};
