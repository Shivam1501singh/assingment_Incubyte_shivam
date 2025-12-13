import { useState } from "react";
import api from "../api/axios";

export default function AddSweet({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/sweets", {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      onAdd(res.data);
      setForm({ name: "", category: "", price: "", quantity: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add sweet");
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Add Sweet (Admin)</h3>

      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Quantity"
        type="number"
        value={form.quantity}
        onChange={e => setForm({ ...form, quantity: e.target.value })}
      />

      <button>Add</button>
    </form>
  );
}
