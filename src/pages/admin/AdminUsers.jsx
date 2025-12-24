import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // FETCH USERS
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // BLOCK / UNBLOCK USER
  const toggleBlock = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 FILTER USERS
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        {/* Header + Search */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Users</h1>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="font-serif font-bold">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 capitalize">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">
                        {user.blocked ? (
                          <span className="text-red-500 font-semibold">
                            Blocked
                          </span>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => toggleBlock(user._id)}
                          className={`px-3 py-1 rounded text-white ${
                            user.blocked
                              ? "bg-green-600"
                              : "bg-yellow-600"
                          }`}
                        >
                          {user.blocked ? "Unblock" : "Block"}
                        </button>

                        <button
                          onClick={() => deleteUser(user._id)}
                          className="px-3 py-1 rounded bg-red-600 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

