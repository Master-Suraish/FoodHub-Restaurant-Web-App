import { useEffect, useState } from "react";
import { userAPI } from "../services/api";
import {
  Users,
  Mail,
  ShieldCheck,
  Search,
  Loader2,
  UserMinus,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import ConfirmToast from "../components/ConfirmToast";

export default function AdminUsers() {
  const showToast = useToast();
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    id: null,
    name: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id, name) => {
    setConfirmData({ isOpen: true, id, name });
  };

  const handleConfirmDelete = async () => {
    const { id, name } = confirmData;
    setConfirmData({ ...confirmData, isOpen: false });

    try {
      setLoading(true);
      await userAPI.deleteUser(id);
      await fetchUsers();
      showToast(`${name} has been removed.`, "success");
    } catch (err) {
      showToast("Could not delete user.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 font-sans text-slate-900">
      <ConfirmToast
        isOpen={confirmData.isOpen}
        message={`This will permanently delete ${confirmData.name}. This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmData({ ...confirmData, isOpen: false })}
      />

      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              User{" "}
              <span className="text-orange-600 not-italic underline decoration-orange-200 decoration-4 underline-offset-4">
                Directory.
              </span>
            </h1>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">
              System Management / User Control
            </p>
          </div>

          {/* SEARCH BAR  */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-2 border-slate-200 pl-12 pr-6 py-3.5 rounded-2xl font-bold text-sm text-slate-800 shadow-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none w-full md:w-96 transition-all"
            />
          </div>
        </div>

        {/* USERS TABLE */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Users size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-800">No users found</h2>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  {/* Header */}
                  <tr className="bg-slate-900 text-white">
                    <th className="py-5 px-8 text-left text-xs font-black uppercase tracking-widest">
                      Profile
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-black uppercase tracking-widest">
                      Role
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-black uppercase tracking-widest">
                      Joined Date
                    </th>
                    <th className="py-5 px-8 text-right text-xs font-black uppercase tracking-widest">
                      Management
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg border-2 border-slate-800 shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base leading-tight">
                              {user.name}
                            </p>
                            <p className="text-slate-600 font-bold text-xs mt-0.5 flex items-center gap-1">
                              <Mail size={12} className="text-orange-500" />{" "}
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          <ShieldCheck size={12} />
                          {user.role}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-slate-700 font-bold text-sm">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button
                          onClick={() => handleDeleteClick(user._id, user.name)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-200 group"
                        >
                          <UserMinus
                            size={14}
                            className="group-hover:scale-110 transition-transform"
                          />
                          Delete User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
