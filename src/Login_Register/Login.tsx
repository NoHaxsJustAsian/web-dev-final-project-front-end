import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE; // Replace with your actual API base URL

function AuthScreen() {
    const nav = useNavigate();
    const [formMode, setFormMode] = useState('login'); // 'login' or 'register'
    const [userRole, setUserRole] = useState('buyer'); // 'buyer' or 'seller'
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleAuth = async () => {
        const endpoint = formMode === 'login' ? '/login' : '/register';
        const data = formMode === 'login'
            ? { email, password }
            : { email, password, firstName, lastName, role: userRole };

        try {
            const response = await axios.post(`${API_BASE}${endpoint}`, data);
            console.log(response);
            nav(formMode === 'login' ? "/dashboard" : "/welcome"); // Adjust the route as needed
        } catch (error) {
            console.error("Auth error:", error);
        }
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formMode === 'register' && password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        handleAuth();
    };

    const toggleFormMode = () => {
        setFormMode(formMode === 'login' ? 'register' : 'login');
    };

    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    {/* Image and text content here */}
                </section>
                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl">
        <div>
        <img src="/logo-black-horizontal-crop.png"/>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formMode === 'register' && (
                    <>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                        >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {formMode === 'register' && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <button type="submit" className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                    {formMode === 'login' ? 'Login' : 'Create an account'}
                </button>
            </form>
            <button style={{ marginTop: '10px', padding: '10px 20px', background: 'none', border: 'none' }}>
    {formMode === 'login' ? (
        <span onClick={toggleFormMode} style={{ cursor: 'pointer', color: 'blue'}}>
            Don't have an account? Register
        </span>
        ) : (
        <span onClick={toggleFormMode} style={{ cursor: 'pointer', color: 'blue'}}>
            Already have an account? Login
        </span>
    )}
</button>
        </div>
        </div>
                </main>
            </div>
        </section>
    );
}

export default AuthScreen;
