import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  fullname: string;
  email: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin", { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const response = await axios.patch(`/admin/${userId}`, {}, { withCredentials: true });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: response.data } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">Admin Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg max-w-5xl mx-auto overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">No users found.</div>
        ) : (
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                <th className="p-2 md:p-3 text-left">Name</th>
                <th className="p-2 md:p-3 text-left">Email</th>
                <th className="p-2 md:p-3 text-center">Status</th>
                <th className="p-2 md:p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t dark:border-gray-700 text-sm md:text-base">
                  <td className="p-2 md:p-3">{user.fullname}</td>
                  <td className="p-2 md:p-3">{user.email}</td>
                  <td className="p-2 md:p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs md:text-sm rounded font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-2 md:p-3 text-center">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-white font-semibold transition shadow-md text-xs md:text-sm ${
                        user.status === "ACTIVE"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
