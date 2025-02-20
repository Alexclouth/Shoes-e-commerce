import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../Firebase/firebase"; // Adjust the path if needed
import { getAuth, deleteUser } from "firebase/auth"; // Import Firebase Auth for user deletion

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const db = getFirestore(); // Firestore reference
  const authInstance = getAuth(); // Firebase Auth instance

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from Firestore
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setLoading(false);
      } catch (err) {
        setError("Error fetching users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError("Error updating role");
    }
  };

  const handleDeleteUser = async (userId, uid) => {
    try {
      // Delete user from Firestore
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
  
      // If the user to be deleted is the currently authenticated user, log them out
      if (authInstance.currentUser?.uid === uid) {
        alert("Your account has been deleted successfully.");
        // Optionally log out the admin if they deleted themselves
        authInstance.signOut();
        return;
      }
  
      // Update local state after deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Error deleting user: " + err.message);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 text-black pt-20">
      <h2 className="text-2xl font-bold text-center mb-6">User Management</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <table className="min-w-full table-auto border-collapse border-gray-900 rounded">
        <thead>
          <tr className="bg-slate-500 text-left text-lg px-2">
            <th className="border px-2 py-3">Email</th>
            <th className="border px-2 py-3">Role</th>
            <th className="border px-2 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="px-4 py-2 border rounded"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteUser(user.id, user.uid)}
                  className="text-red-500 hover:underline p-2 bg-red-200 hover:bg-red-300 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
