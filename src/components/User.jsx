import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { Trash2, Pencil, PlusCircle } from "lucide-react";
import Modal from "../components/Modal";

const User = () => {
  const { userList, fetchUsers, addUser, updateUser, deleteUser, loading, message, error } = useUserStore();
  const [form, setForm] = useState({ nama: "", email: "", password: "", no_hp: "", role: "guru" });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateUser(editId, form);
    } else {
      await addUser(form);
    }
    setForm({ nama: "", email: "", password: "", no_hp: "", role: "guru" });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({ nama: user.nama, email: user.email, password: user.password, no_hp: user.no_hp, role: user.role });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <PlusCircle size={18} /> Tambah Pengguna
        </button>
      </div>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">Nama</th>
              <th className="p-2">Email</th>
              <th className="p-2">No HP</th>
              <th className="p-2">Role</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, i) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{user.nama}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.no_hp}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button onClick={() => handleEdit(user)} className="bg-yellow-400 hover:bg-yellow-500 p-1 rounded text-white">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteUser(user._id)} className="bg-red-600 hover:bg-red-700 p-1 rounded text-white">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {userList.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500 italic">
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditId(null);
        }}
        title={editId ? "Edit Pengguna" : "Tambah Pengguna"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required className="w-full p-2 border rounded" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
          <input type="text" name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="No HP" required className="w-full p-2 border rounded" />
          <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
            {editId ? "Update" : "Simpan"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default User;
