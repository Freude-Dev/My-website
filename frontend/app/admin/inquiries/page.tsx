"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch } from '../login/actions';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    const result = await adminFetch('/inquiries');
    if (result.success) {
      setInquiries(result.data);
    } else {
      toast.error('Failed to load inquiries');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const loadingToast = toast.loading('Deleting inquiry...');
    
    try {
      const res = await adminFetch(`/inquiries/${id}`, { method: 'DELETE' });
      if (res.success) {
        toast.success('Inquiry deleted', { id: loadingToast });
        setInquiries(inquiries.filter(i => i._id !== id));
      } else {
        toast.error('Failed to delete inquiry', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Inquiries</h2>
          <p className="text-zinc-400 text-sm">Manage messages from potential clients.</p>
        </div>
        <div className="badge badge-orange-600 p-4 font-bold">{inquiries.length} Total</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <Mail size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">No inquiries found.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-orange-500 font-bold">
                      <User size={16} />
                      {inquiry.firstName} {inquiry.lastName}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Mail size={16} />
                      {inquiry.email}
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Phone size={16} />
                        {inquiry.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Calendar size={16} />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                    <p className="text-zinc-300 leading-relaxed">{inquiry.message}</p>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <a 
                    href={`mailto:${inquiry.email}`}
                    className="btn btn-sm btn-ghost text-blue-400 hover:bg-blue-400/10"
                  >
                    Reply
                  </a>
                  <button 
                    onClick={() => handleDelete(inquiry._id)}
                    className="btn btn-sm btn-ghost text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}