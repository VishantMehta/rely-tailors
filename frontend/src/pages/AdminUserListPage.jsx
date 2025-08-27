import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../features/users/userSlice';

// --- Background Cubes Component ---
const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <ul className="circles">
            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        </ul>
    </div>
);

const AdminUserListPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <div className="bg-[#f2f2f2] min-h-screen relative">
            <BackgroundCubes />
            <div className="container mx-auto p-8 relative z-10">
                <h1 className="font-marcellus text-4xl text-slate-900 mb-8" data-aos="fade-down">
                    Manage Users
                </h1>
                {loading ? <p>Loading users...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 overflow-x-auto" data-aos="fade-up">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-3">User ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Admin</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="bg-white/50 border-b border-slate-200/50">
                                        <td className="px-6 py-4 font-medium text-slate-600">{user._id}</td>
                                        <td className="px-6 py-4">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="text-green-500 font-bold">Yes</span>
                                            ) : (
                                                <span className="text-slate-500">No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deleteHandler(user._id)} className="font-medium text-red-600 hover:underline">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserListPage;
