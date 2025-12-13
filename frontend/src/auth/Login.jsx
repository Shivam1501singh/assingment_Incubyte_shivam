import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
  const res = await api.post("/auth/login", form);
  localStorage.setItem("token", res.data.token);
  alert("Logged In");
} catch (err) {
  console.error(err.response?.data);
  alert(err.response?.data?.message || "Login failed");
}

  };

  return (
    <form onSubmit={submit}>
      
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button>Login</button>
    </form>
  );
}

