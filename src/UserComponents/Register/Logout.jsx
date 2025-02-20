import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Successfully signed out
        navigate("/signin"); // Redirect to the sign-in page
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Logging you out...</p>
    </div>
  );
};

export default Logout;
