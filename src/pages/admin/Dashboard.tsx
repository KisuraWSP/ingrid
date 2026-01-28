import { createSignal, onMount, For, Show } from 'solid-js';
import axios from 'axios';
import '../../App.css';

function AdminDashboard() {
    const [users, setUsers] = createSignal<any[]>([]);
    const [loading, setLoading] = createSignal(true);

    const [editingUser, setEditingUser] = createSignal<any>(null); 
    const [editForm, setEditForm] = createSignal({ name: '', role: '' });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.userItem || response.data.users || response.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    onMount(fetchUsers);

    const handleDelete = async (userId: string) => {
        if(!confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/admin/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUsers(users().filter((u) => u._id !== userId));
            alert("User deleted successfully");
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete user");
        }
    }

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setEditForm({ name: user.name, role: user.role });
    }

    const closeEditModal = () => {
        setEditingUser(null);
    }

    const handleUpdate = async (e: Event) => {
        e.preventDefault();
        if (!editingUser()) return;

        try {
            const token = localStorage.getItem('token');
            const userId = editingUser()._id;

            const response = await axios.put(`http://localhost:5000/admin/${userId}`, {
                name: editForm().name,
                role: editForm().role
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedUser = response.data.user; 
            setUsers(users().map(u => u._id === userId ? updatedUser : u));
            
            closeEditModal();
            alert("User updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update user");
        }
    }

    return (
        <div class="p-8 bg-gray-100 min-h-screen relative">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {loading() ? (
                <div class="flex justify-center p-10"><span class="text-xl">Loading users...</span></div>
            ) : (
                <div class="bg-white shadow-md rounded-lg overflow-hidden">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={users()}>
                                {(user) => (
                                    <tr>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p class="text-gray-900 font-medium">{user.name}</p>
                                            <p class="text-gray-500 text-xs">@{user.user_name}</p>
                                        </td>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {user.email}
                                        </td>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span class={`px-3 py-1 font-semibold leading-tight rounded-full ${
                                                user.role === 'admin' ? 'bg-purple-200 text-purple-900' : 
                                                user.role === 'instructor' ? 'bg-blue-200 text-blue-900' : 'bg-green-200 text-green-900'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div class="flex gap-2">
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    class="text-indigo-600 hover:text-indigo-900 font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user._id)}
                                                    class="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                </div>
            )}

            <Show when={editingUser()}>
                <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                    <div class="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 class="text-xl font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleUpdate}>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                <input 
                                    type="text" 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editForm().name}
                                    onInput={(e) => setEditForm({ ...editForm(), name: e.currentTarget.value })}
                                />
                            </div>
                            <div class="mb-6">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <select 
                                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editForm().role}
                                    onChange={(e) => setEditForm({ ...editForm(), role: e.currentTarget.value })}
                                >
                                    <option value="student">student</option>
                                    <option value="instructor">instructor</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>
                            <div class="flex justify-end gap-2">
                                <button 
                                    type="button"
                                    onClick={closeEditModal}
                                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Show>
        </div>
    );
}

export default AdminDashboard;