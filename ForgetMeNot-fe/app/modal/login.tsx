import React, {useState} from "react";
import {Modal} from "~/modal/modal";

const LoginPage = ({ setIsLoggedIn }: { setIsLoggedIn: (val: boolean) => void }) => {
    interface FormData {
        username: string;
        password: string;

        [key: string]: string;  // Add index signature
    }

    interface FormErrors {
        username: string;
        password: string;

        [key: string]: string;  // Add index signature
    }

    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        username: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState<string>(''); // For displaying API error message
    const [loading, setLoading] = useState<boolean>(false); // For showing loading state


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        // Update form data
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        // Clear validation errors
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const loginUser = async () => {
        setLoading(true); // Show loading spinner

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Login successful");
                setIsLoggedIn(true);
            } else {
                setErrorMessage(result.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred. Please try again.");
        }

        setLoading(false);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Perform validation
        const validationErrors: FormErrors = Object.keys(formData).reduce((errors, name) => {
            if (formData[name] === '') {
                errors[name as keyof FormErrors] = `Pole ${name} je povinné`;
            } else if (name === 'username' && !/^\S+$/.test(formData[name])) {
                errors[name as keyof FormErrors] = 'Neplatný username';
            } else if (name === 'password' && formData[name].length < 6) {
                errors[name as keyof FormErrors] = 'Heslo musí mať aspoň 6 znakov';
            }
            return errors;
        }, {} as FormErrors);

        // Update form errors
        setFormErrors(validationErrors);

        // Check if there are any validation errors
        if (Object.values(validationErrors).every((error) => error === '')) {
            // Perform login logic here
            await loginUser();
        }
    };


    return (
        <div className="login-form">
            <h2>Prihlásenie</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Prihlasovacie meno:</label>
                    <input
                        type="username"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={formErrors.username ? 'error' : ''}
                    />
                    {formErrors.username && (
                        <span className="error-message">{formErrors.username}</span>
                    )}
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
                    {formErrors.password && (
                        <span className="error-message">{formErrors.password}</span>
                    )}
                </div>

                <button type="submit" className="submit-btn">
                    Prihlásiť
                </button>
            </form>
        </div>
    );
};


export const Login = ({isOpen, onClose, setIsLoggedIn }: {
    isOpen: boolean;
    onClose: () => void;
    setIsLoggedIn: (val: boolean) => void ;
}) => {
    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <LoginPage setIsLoggedIn={setIsLoggedIn} ></LoginPage>
        </Modal>
    );
};