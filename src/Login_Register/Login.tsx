import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

function AuthScreen() {
  const nav = useNavigate();
  const [formMode, setFormMode] = useState("login"); // 'login' or 'register'
  const [userRole, setUserRole] = useState("buyer"); // 'buyer' or 'seller'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    if (formMode === "register") {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) setError(error.message);
      else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          createProfile(user.id, firstName, lastName, userRole, email, username);
        } else {
          console.error("No user found");
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
      else nav("/dashboard");
    }
    setLoading(false);
  };

  async function createProfile(
    userId: string,
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    username: string
  ) {
    const { data, error } = await supabase.from("users").insert([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        role: role,
        email: email,
        username: username
      },
    ]);

    if (error) {
      console.error("Error creating profile:", error);
    } else {
      console.log("Profile created successfully:", data);
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAuth();
  };

  const toggleFormMode = () => {
    setFormMode(formMode === "login" ? "register" : "login");
  };

  const renderLoginInputs = () => (
    <>
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
    </>
  );

  const renderRegisterInputs = () => (
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
      <input
        type="text"
        placeholder="Username"
        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <select
        value={userRole}
        onChange={(e) => setUserRole(e.target.value)}
        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
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
      <input
        type="password"
        placeholder="Confirm Password"
        className="mt-1 w-full rounded-md border-gray-200 bg-white text-ml p-3 text-gray-700 shadow-sm"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </>
  );

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          {/* Image and text content here */}
        </section>
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div>
              <img src="/logo-black-horizontal-crop.png" alt="Logo" />
                <form
                  onSubmit={onSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {formMode === "register" && renderRegisterInputs()}
                  {formMode === "login" && renderLoginInputs()}
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                    {formMode === "login" ? "Login" : "Create an account"}
                  </button>
                </form>
              {error && <p className="text-red-500">{error}</p>}
              <button
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  background: "none",
                  border: "none",
                }}>
                <span
                  onClick={toggleFormMode}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  {formMode === "login"
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

export default AuthScreen;
