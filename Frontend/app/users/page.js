"use client";
import { useState } from "react";
import AddNewUser from "@/components/Dashboard/AddNewUser";

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Management</h1>
      <button onClick={() => setShowModal(true)}>Add New User</button>
      {showModal && <AddNewUser onClose={() => setShowModal(false)} />}
    </div>
  );
}
