import React, { useEffect, useState } from 'react';
import { getAdminUsers, blacklistUser, unblacklistUser, promoteUser, demoteUser, deleteUser, AdminUser } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { PremiumBackground } from '../components/PremiumBackground';
import { Shield, AlertTriangle, UserX, Crown, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const isBlackAdmin = user?.role === 'black_admin';
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAdminUsers(0, 50, search);
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const handleAction = async (actionFn: (id: string) => Promise<any>, id: string, email: string, actionName: string) => {
        if (!window.confirm(`Are you sure you want to ${actionName} user ${email}?`)) return;

        try {
            await actionFn(id);
            alert(`Successfully ${actionName}ed ${email}`);
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.detail || `Failed to ${actionName}`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <PremiumBackground />
            <PremiumNavbar />

            <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-purple-500 to-indigo-500">
                                User Management
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 font-light">
                            {isBlackAdmin ? 'Super admin access granted.' : 'Read-only admin view.'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/admin/inactivity"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors"
                        >
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span>Inactivity</span>
                        </Link>
                        {isBlackAdmin && (
                            <Link
                                to="/admin/command-centre"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-900/40 border border-red-500/50 hover:bg-red-800/50 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                            >
                                <Shield className="w-4 h-4 text-red-400" />
                                <span className="text-red-100 font-medium">Command Centre</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-light tracking-wide backdrop-blur-sm"
                    />
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/30 text-xs uppercase tracking-wider text-slate-400">
                                    <th className="p-5 font-semibold">User</th>
                                    <th className="p-5 font-semibold">Role</th>
                                    <th className="p-5 font-semibold">Status</th>
                                    <th className="p-5 font-semibold">Last Active</th>
                                    {isBlackAdmin && <th className="p-5 font-semibold text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400">Loading users...</td>
                                    </tr>
                                ) : users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-200">{u.full_name}</span>
                                                <span className="text-sm text-slate-500">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${u.role === 'black_admin' ? 'bg-red-900/30 text-red-400 border-red-800/50' :
                                                u.role === 'admin' ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' :
                                                    'bg-slate-800 text-slate-300 border-slate-700'
                                                }`}>
                                                {u.role === 'black_admin' && <Crown className="w-3 h-3" />}
                                                {u.role.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            {u.is_blacklisted ? (
                                                <span className="inline-flex items-center text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded">
                                                    Blacklisted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-sm text-slate-400">
                                            {u.last_active_at ? new Date(u.last_active_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        {isBlackAdmin && (
                                            <td className="p-5 text-right">
                                                {u.role !== 'black_admin' && (
                                                    <div className="flex justify-end gap-2">
                                                        {u.role === 'user' ? (
                                                            <button onClick={() => handleAction(promoteUser, u.id, u.email, 'promote')} className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/20" title="Promote to Admin">
                                                                <Crown className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleAction(demoteUser, u.id, u.email, 'demote')} className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors border border-orange-500/20" title="Demote to User">
                                                                <Settings className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {u.is_blacklisted ? (
                                                            <button onClick={() => handleAction(unblacklistUser, u.id, u.email, 'unblacklist')} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-emerald-500/20">
                                                                Unblock
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleAction(blacklistUser, u.id, u.email, 'blacklist')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20" title="Blacklist User">
                                                                <UserX className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {u.is_blacklisted && (
                                                            <button onClick={() => handleAction(deleteUser, u.id, u.email, 'delete')} className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-200 rounded-lg text-xs font-medium transition-colors border border-red-800 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                                                DELETE
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
