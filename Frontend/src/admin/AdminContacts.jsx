import { useEffect, useState } from "react";
import { contactAPI } from "../services/api";
import {
  Trash2,
  Mail,
  Phone,
  FileText,
  Loader2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Search,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import ConfirmToast from "../components/ConfirmToast";

export default function AdminContactPage() {
  const showToast = useToast();
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    id: null,
    name: "",
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 8;

  const fetchContacts = async (p = 1) => {
    try {
      setLoading(true);
      const res = await contactAPI.getAllContacts(p, limit);
      setContacts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch contact messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleDeleteClick = (id, name) => {
    setConfirmData({ isOpen: true, id, name });
  };

  const handleConfirmDelete = async () => {
    const { id, name } = confirmData;
    setConfirmData({ ...confirmData, isOpen: false });

    try {
      setLoading(true);
      await contactAPI.deleteContact(id);
      await fetchContacts();
      showToast(`${name} message has been removed.`, "success");
    } catch (err) {
      showToast("Could not delete user message.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        message={`Are you sure to remove ${confirmData.name} message ?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmData({ ...confirmData, isOpen: false })}
      />

      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Inquiry{" "}
              <span className="text-orange-600 not-italic underline decoration-orange-200 decoration-4 underline-offset-4">
                Inbox.
              </span>
            </h1>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">
              Customer Communications / Feedback
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* 3. SEARCH INPUT */}
            <div className="relative group w-full md:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-slate-900 transition-all font-bold text-sm shadow-sm"
              />
            </div>

            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-slate-200 shadow-sm w-full md:w-auto text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Total Messages
              </p>
              <p className="text-2xl font-black text-slate-900">
                {contacts.length * totalPages}+
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-800">
              {searchQuery
                ? "No matches found for your search"
                : "No messages found"}
            </h2>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-white rounded-[2.5rem] border-2 border-slate-900 shadow-xl shadow-slate-200 overflow-hidden flex flex-col group transition-all hover:-translate-y-1"
                >
                  {/* BLACK CARD HEADER */}
                  <div className="bg-slate-900 p-6 flex justify-between items-center text-white border-b-4 border-orange-600">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/40">
                        <User
                          size={20}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>
                      <div>
                        <h3 className="font-black text-base tracking-tighter uppercase italic">
                          {contact.name}
                        </h3>
                        <div className="flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-widest">
                          <Mail size={12} strokeWidth={3} />{" "}
                          {contact.email || "No Email"}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteClick(contact._id, contact.name)
                      }
                      className="p-3 bg-slate-800 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* CARD BODY */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Phone
                          size={14}
                          className="text-slate-400"
                          strokeWidth={3}
                        />
                        <span className="uppercase tracking-widest">Call:</span>{" "}
                        {contact.phone || "Not provided"}
                      </div>
                      <div className="flex items-center gap-3 text-slate-900 font-black text-xs px-2">
                        <FileText
                          size={16}
                          className="text-orange-600"
                          strokeWidth={3}
                        />
                        <span className="uppercase tracking-tighter italic">
                          {contact.subject || "No Subject"}
                        </span>
                      </div>
                    </div>

                    <div className="relative bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-sm text-slate-700 font-bold leading-relaxed italic">
                        "{contact.message}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {new Date(contact.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {!searchQuery && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-4 bg-white border-2 border-slate-900 rounded-2xl hover:bg-orange-600 hover:text-white disabled:opacity-20 transition-all shadow-[4px_4px_0px_0px_#0f172a]"
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>

                <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs tracking-[0.2em] uppercase">
                  {page} / {totalPages}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-4 bg-white border-2 border-slate-900 rounded-2xl hover:bg-orange-600 hover:text-white disabled:opacity-20 transition-all shadow-[4px_4px_0px_0px_#0f172a]"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
