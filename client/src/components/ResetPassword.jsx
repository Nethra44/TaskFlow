import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/api/reset-password/${id}`, {
        password,
      });

      alert("Password updated successfully!");
      navigate("/");
    } catch (err) {
      alert("Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
