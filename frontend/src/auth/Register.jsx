import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

const submit = async (e) => {
    e.preventDefault();
 try {
  const res = await api.post("/auth/register", form);
  localStorage.setItem("token", res.data.token);
  alert("Registered");
 } catch (err) {
  console.error(err.response?.data);
  alert(err.response?.data?.message || "Registration failed");
 }
};

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button>Register</button>
    </form>
  );
}
