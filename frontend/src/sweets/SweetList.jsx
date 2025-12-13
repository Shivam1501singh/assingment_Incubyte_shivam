import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout, getUserRole } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import AddSweet from "./AddSweet";

export default function SweetList() {
  const [sweets, setSweets] = useState([]);
  const [purchaseQty, setPurchaseQty] = useState({});
  const [restockQty, setRestockQty] = useState({});

  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    api.get("/sweets").then(res => setSweets(res.data));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePurchase = async (sweetId) => {
    const amount = Number(purchaseQty[sweetId] || 1);

    try {
      const res = await api.post(`/sweets/${sweetId}/purchase`, {
        amount,
      });

      // update local state from backend response
      setSweets(prev =>
        prev.map(s =>
          s._id === sweetId ? res.data : s
        )
      );

      setPurchaseQty(prev => ({ ...prev, [sweetId]: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleRestock = async (sweetId) => {
  const amount = Number(restockQty[sweetId]);

  if (!amount || amount <= 0) {
    alert("Enter valid restock amount");
    return;
  }

  try {
    const res = await api.post(`/sweets/${sweetId}/restock`, {
      amount,
    });

    // replace sweet from backend response
    setSweets(prev =>
      prev.map(s =>
        s._id === sweetId ? res.data : s
      )
    );

    setRestockQty(prev => ({ ...prev, [sweetId]: "" }));
  } catch (err) {
    alert(err.response?.data?.message || "Restock failed");
  }
};


  return (
    <div>
      <button onClick={handleLogout}>Logout</button>

      {role === "admin" && (
        <AddSweet onAdd={(sweet) => setSweets(prev => [...prev, sweet])} />
      )}

      <h2>Sweets</h2>

      {sweets.map(s => (
        <div key={s._id} style={{ marginBottom: 12 }}>
          <strong>{s.name}</strong> — ₹{s.price} (Qty: {s.quantity})

          <div>
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={purchaseQty[s._id] || ""}
              onChange={e =>
                setPurchaseQty({
                  ...purchaseQty,
                  [s._id]: e.target.value,
                })
              }
            />

            <button
              onClick={() => handlePurchase(s._id)}
              disabled={s.quantity === 0}
            >
              Purchase
            </button>
          </div>
  {role === "admin" && (
  <div style={{ marginTop: 6 }}>
    <input
      type="number"
      min="1"
      placeholder="Restock Qty"
      value={restockQty[s._id] || ""}
      onChange={e =>
        setRestockQty({
          ...restockQty,
          [s._id]: e.target.value,
        })
      }
    />

    <button onClick={() => handleRestock(s._id)}>
      Restock
    </button>
  </div>
)}

        </div>
      ))}
    </div>
  );
}
