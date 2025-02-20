import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const auth = getAuth();
    try {
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setEmail(""); // Reset email field
      setPassword(""); // Reset password field
      navigate("/"); // Redirect to home page after successful sign-in
    } catch (err) {
      setLoading(false);
      // Firebase error messages are typically specific
      const errorMessage =
        err.code === "auth/user-not-found"
          ? "No user found with this email."
          : err.code === "auth/wrong-password"
          ? "Incorrect password."
          : "Failed to sign in. Please try again.";
      setError(errorMessage); // Display the error message
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-6 text-yellow-700">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSignIn}>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gray-400"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-500 hover:underline font-bold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
