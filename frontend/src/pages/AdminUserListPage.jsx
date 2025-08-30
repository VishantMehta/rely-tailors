import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, AlertTriangle, Search, Shield, UserCheck, UserX } from 'lucide-react';
import { fetchUsers, deleteUser, updateUserRole } from '../features/users/userSlice';


const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-50">
        <ul className="circles">
            {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
    </div>
);


const UserListSkeleton = () => (
    <div className="animate-pulse">
        {/* Mobile Card Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 bg-zinc-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-zinc-200 rounded w-28"></div>
                                <div className="h-3 bg-zinc-200 rounded w-36"></div>
                            </div>
                        </div>
                        <div className="h-5 w-16 bg-zinc-200 rounded-full"></div>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="h-3 bg-zinc-200 rounded w-8"></div>
                            <div className="h-8 bg-zinc-200 rounded w-28"></div>
                        </div>
                        <div className="h-9 w-9 bg-zinc-200 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-200">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 bg-zinc-200 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-200 rounded w-32"></div>
                            <div className="h-3 bg-zinc-200 rounded w-48"></div>
                        </div>
                    </div>
                    <div className="h-4 bg-zinc-200 rounded w-40 mx-6 flex-1"></div>
                    <div className="h-6 bg-zinc-200 rounded-md w-24 mx-6 flex-1"></div>
                    <div className="h-8 bg-zinc-200 rounded-full w-8 mx-6"></div>
                </div>
            ))}
        </div>
    </div>
);


const UserCard = ({ user, currentUser, onRoleChange, onDelete }) => {
    const isCurrentUser = user._id === currentUser._id;
    const roleColor = user.role === 'admin' ? 'bg-sky-100 text-sky-800' : 'bg-zinc-100 text-zinc-800';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-lg text-zinc-600 flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-zinc-800 truncate">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColor} capitalize`}>
                    {user.role}
                </span>
            </div>

            <div className="border-t border-zinc-100 pt-3 flex items-end justify-between gap-2">
                <div>
                    <label htmlFor={`role-select-${user._id}`} className="text-xs font-medium text-zinc-500">Role</label>
                    <select
                        id={`role-select-${user._id}`}
                        value={user.role}
                        onChange={(e) => onRoleChange(user._id, e.target.value)}
                        disabled={isCurrentUser}
                        className="mt-1 w-full p-1.5 border border-zinc-300 rounded-md text-zinc-700 bg-white text-xs focus:ring-1 focus:outline-none focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    onClick={() => onDelete(user)}
                    disabled={isCurrentUser}
                    className="h-9 w-9 flex items-center justify-center text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
};


const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading, confirmText, Icon, variant = 'danger' }) => {
    const themes = {
        danger: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            buttonBg: 'bg-red-600',
            buttonHover: 'hover:bg-red-700',
            buttonDisabled: 'disabled:bg-red-300',
        },
        primary: {
            bg: 'bg-sky-100',
            text: 'text-sky-600',
            buttonBg: 'bg-sky-600',
            buttonHover: 'hover:bg-sky-700',
            buttonDisabled: 'disabled:bg-sky-300',
        }
    };
    const theme = themes[variant] || themes.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${theme.bg} sm:mx-0 sm:h-10 sm:w-10`}>
                                <Icon className={`h-6 w-6 ${theme.text}`} />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-zinc-900">{title}</h3>
                                <div className="mt-2"><p className="text-sm text-zinc-500">{message}</p></div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                            <button onClick={onConfirm} disabled={isLoading} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:w-auto sm:text-sm ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonDisabled}`}>
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : confirmText}
                            </button>
                            <button onClick={onCancel} disabled={isLoading} className="mt-3 w-full inline-flex justify-center rounded-md border border-zinc-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-zinc-700 hover:bg-zinc-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};


// --- Main Component ---

const AdminUserListPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);
    const currentUser = useSelector((state) => state.auth.userInfo);

    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToUpdateRole, setUserToUpdateRole] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const deleteHandler = () => {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete._id));
            setUserToDelete(null);
        }
    };

    const roleChangeHandler = (id, role) => {
        setUserToUpdateRole({ id, role });
    };

    const confirmRoleChange = () => {
        if (userToUpdateRole) {
            dispatch(updateUserRole(userToUpdateRole));
            setUserToUpdateRole(null);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        if (!searchTerm) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    return (
        <div className="bg-zinc-50 min-h-screen relative font-sans">
            <BackgroundCubes />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
                <header className="mb-8">
                    <h1 className="font-marcellus text-3xl sm:text-4xl font-bold text-zinc-900">Manage Users</h1>
                    <p className="text-zinc-500 mt-1">View, edit roles, and manage system users.</p>
                </header>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by Name or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:max-w-md border border-zinc-300 rounded-full pl-12 pr-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                        />
                    </div>

                    {loading ? <UserListSkeleton /> : error ? (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3"><AlertTriangle className="h-5 w-5" /> {error}</div>
                    ) : (
                        <>
                            {/* --- Mobile Card View --- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
                                <AnimatePresence>
                                    {filteredUsers.map(user => (
                                        <UserCard
                                            key={user._id}
                                            user={user}
                                            currentUser={currentUser}
                                            onRoleChange={roleChangeHandler}
                                            onDelete={setUserToDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* --- Desktop Table View --- */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/70">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">User</th>
                                            <th className="px-6 py-4 font-semibold">User ID</th>
                                            <th className="px-6 py-4 font-semibold">Role</th>
                                            <th className="px-6 py-4 font-semibold text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user._id} className="bg-white border-b hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-zinc-600 flex-shrink-0">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-zinc-800">{user.name}</p>
                                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-zinc-500">{user._id}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => roleChangeHandler(user._id, e.target.value)}
                                                        className={`p-1.5 border border-zinc-300 rounded-md text-zinc-700 bg-white text-xs focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        disabled={user._id === currentUser._id}
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setUserToDelete(user)}
                                                        className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={user._id === currentUser._id}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!userToDelete}
                title="Delete User"
                message={`Are you sure you want to permanently delete user "${userToDelete?.name}"? This action is irreversible.`}
                onConfirm={deleteHandler}
                onCancel={() => setUserToDelete(null)}
                confirmText="Delete User"
                Icon={UserX}
                variant="danger"
            />

            <ConfirmationModal
                isOpen={!!userToUpdateRole}
                title="Update Role"
                message={`Change this user's role to "${userToUpdateRole?.role}"? They will gain permissions associated with this new role.`}
                onConfirm={confirmRoleChange}
                onCancel={() => setUserToUpdateRole(null)}
                confirmText="Confirm Change"
                Icon={UserCheck}
                variant="primary"
            />
        </div>
    );
};

export default AdminUserListPage;