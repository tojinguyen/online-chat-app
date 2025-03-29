import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = () => {
    setMessage("If the email exists, a reset link has been sent.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
          onClick={handleReset}
        >
          Reset Password
        </button>
        <p className="text-center mt-2 text-green-500">{message}</p>
      </div>
    </div>
  );
}
