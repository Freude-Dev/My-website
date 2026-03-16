"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Mail, Calendar, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch } from '../login/actions';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    const result = await adminFetch('/newsletter');
    if (result.success) {
      setSubscribers(result.data);
    } else {
      toast.error('Failed to load subscribers');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    const loadingToast = toast.loading('Removing subscriber...');
    
    try {
      const res = await adminFetch(`/newsletter/${id}`, { method: 'DELETE' });
      if (res.success) {
        toast.success('Subscriber removed', { id: loadingToast });
        fetchSubscribers();
      } else {
        toast.error('Failed to remove subscriber', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Subscribed\n"
      + subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subscribers exported to CSV');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
          <p className="text-zinc-400 text-sm">Manage your email list and export data for marketing.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="btn btn-ghost text-orange-500 border-orange-500/20 hover:bg-orange-500/10"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-xs">
              <th className="bg-transparent">Email Address</th>
              <th className="bg-transparent">Subscribed Date</th>
              <th className="bg-transparent text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-zinc-500">
                  <Mail size={48} className="mx-auto mb-4 opacity-20" />
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="bg-transparent">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Mail size={16} />
                      </div>
                      <span className="font-medium text-zinc-200">{sub.email}</span>
                    </div>
                  </td>
                  <td className="bg-transparent text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="bg-transparent text-right">
                    <button 
                      onClick={() => handleDelete(sub._id)}
                      className="btn btn-sm btn-ghost text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}