import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, Loader2, AlertTriangle, Search, Shield, 
    UserCheck, UserX, Mail, User as UserIcon, ShieldCheck 
} from 'lucide-react';
import { fetchUsers, deleteUser, updateUserRole } from '../features/users/userSlice';

// --- Skeleton Loader ---
const UserListSkeleton = () => (
    <div className="animate-pulse space-y-4">
        {/* Mobile Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-sm p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-stone-200 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-stone-200 rounded w-24"></div>
                            <div className="h-3 bg-stone-200 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="h-8 bg-stone-200 rounded w-full"></div>
                </div>
            ))}
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden md:block">
            <div className="h-12 bg-stone-200 w-full mb-4 rounded-sm"></div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-stone-100">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 bg-stone-200 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-stone-200 rounded w-32"></div>
                            <div className="h-3 bg-stone-200 rounded w-48"></div>
                        </div>
                    </div>
                    <div className="h-8 bg-stone-200 rounded w-24 mx-6"></div>
                    <div className="h-8 bg-stone-200 rounded w-20 mx-6"></div>
                    <div className="h-8 bg-stone-200 rounded w-8 mx-6"></div>
                </div>
            ))}
        </div>
    </div>
);

// --- Mobile User Card ---
const UserCard = ({ user, currentUser, onRoleChange, onDelete }) => {
    const isCurrentUser = user._id === currentUser._id;
    const isAdmin = user.role === 'admin';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-white border ${isCurrentUser ? 'border-amber-200' : 'border-stone-200'} rounded-sm p-5 flex flex-col gap-4 shadow-sm`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-marcellus text-lg font-bold flex-shrink-0 ${isAdmin ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <p className="font-marcellus text-lg text-stone-900 truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate font-light">{user.email}</p>
                    {isCurrentUser && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1 block">It's You</span>}
                </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1 block">Role</label>
                    <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user._id, e.target.value)}
                        disabled={isCurrentUser}
                        className="w-full p-2 border border-stone-200 rounded-sm text-stone-700 bg-stone-50 text-xs focus:ring-1 focus:outline-none focus:ring-amber-700 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-bold"
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    onClick={() => onDelete(user)}
                    disabled={isCurrentUser}
                    className="h-9 w-9 flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-20 mt-4"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
};

// --- Reusable Confirmation Modal ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading, confirmText, Icon, variant = 'danger' }) => {
    const isDanger = variant === 'danger';
    
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-white rounded-sm w-full max-w-sm p-6 shadow-2xl border-t-4 ${isDanger ? 'border-red-600' : 'border-amber-600'}`}>
                        <div className="text-center">
                            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-marcellus text-xl text-stone-900 mb-2">{title}</h3>
                            <p className="text-sm text-stone-500 font-light leading-relaxed mb-6">{message}</p>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                            <button onClick={onCancel} disabled={isLoading} className="w-full inline-flex justify-center rounded-sm border border-stone-300 px-4 py-3 bg-white text-xs font-bold uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
                            <button 
                                onClick={onConfirm} 
                                disabled={isLoading} 
                                className={`w-full inline-flex justify-center rounded-sm border border-transparent px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors ${isDanger ? 'bg-red-700 hover:bg-red-800' : 'bg-stone-900 hover:bg-stone-800'}`}
                            >
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : confirmText}
                            </button>
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
        <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
            <div className="container mx-auto p-4 sm:p-8 lg:p-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
                    <div>
                        <h1 className="font-marcellus text-3xl sm:text-4xl text-stone-900 mb-2">User Management</h1>
                        <p className="text-stone-500 font-light text-sm">Oversee customers and administrators.</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-sm pl-10 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all placeholder-stone-400"
                        />
                    </div>
                </div>

                <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-1">
                    {loading ? <div className="p-6"><UserListSkeleton /></div> : error ? (
                        <div className="bg-red-50 text-red-700 p-6 flex items-center gap-3"><AlertTriangle className="h-5 w-5" /> {error}</div>
                    ) : (
                        <>
                            {/* --- Mobile Card View --- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:hidden bg-stone-50">
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
                                    <thead className="text-[10px] uppercase tracking-widest text-stone-500 bg-stone-50/80 border-b border-stone-100">
                                        <tr>
                                            <th className="px-6 py-5 font-bold">User Profile</th>
                                            <th className="px-6 py-5 font-bold">User ID</th>
                                            <th className="px-6 py-5 font-bold">Current Role</th>
                                            <th className="px-6 py-5 font-bold text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {filteredUsers.map(user => {
                                            const isCurrentUser = user._id === currentUser._id;
                                            const isAdmin = user.role === 'admin';
                                            return (
                                                <tr key={user._id} className={`bg-white hover:bg-amber-50/30 transition-colors group ${isCurrentUser ? 'bg-amber-50/20' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-marcellus font-bold text-sm ${isAdmin ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-stone-900 flex items-center gap-2">
                                                                    {user.name}
                                                                    {isCurrentUser && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 rounded-full">YOU</span>}
                                                                </p>
                                                                <div className="flex items-center gap-1 text-xs text-stone-400 font-light mt-0.5">
                                                                    <Mail size={12} /> {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs text-stone-500">{user._id.slice(-8)}</td>
                                                    <td className="px-6 py-4">
                                                        {isCurrentUser ? (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                                                <ShieldCheck size={12} /> Admin
                                                            </div>
                                                        ) : (
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => roleChangeHandler(user._id, e.target.value)}
                                                                className="p-2 border border-stone-200 rounded-sm text-stone-700 bg-white text-xs font-bold uppercase tracking-wider focus:ring-1 focus:ring-amber-700 cursor-pointer hover:border-amber-700 transition-colors"
                                                            >
                                                                <option value="customer">Customer</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => setUserToDelete(user)}
                                                            disabled={isCurrentUser}
                                                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="p-12 text-center text-stone-400 font-light">
                                        <UserIcon size={48} className="mx-auto mb-3 opacity-20" />
                                        No users found matching your search.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!userToDelete}
                title="Delete User"
                message={`Are you sure you want to permanently delete "${userToDelete?.name}"? This will remove their order history and account access.`}
                onConfirm={deleteHandler}
                onCancel={() => setUserToDelete(null)}
                confirmText="Delete User"
                Icon={UserX}
                variant="danger"
            />

            <ConfirmationModal
                isOpen={!!userToUpdateRole}
                title="Update Role"
                message={`Change role to "${userToUpdateRole?.role?.toUpperCase()}"? This will update their permissions immediately.`}
                onConfirm={confirmRoleChange}
                onCancel={() => setUserToUpdateRole(null)}
                confirmText="Update Role"
                Icon={Shield}
                variant="primary" // Maps to Amber/Stone theme in component
            />
        </div>
    );
};

export default AdminUserListPage;