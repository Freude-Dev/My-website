"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Star, Quote, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch } from '../login/actions';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    const result = await adminFetch('/admin/testimonials');
    if (result.success) {
      setTestimonials(result.data);
    } else {
      toast.error('Failed to load testimonials');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading(`Updating status to ${newStatus}...`);
    const res = await adminFetch(`/admin/testimonials/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.success) {
      toast.success(`Testimonial ${newStatus}`, { id: loadingToast });
      fetchTestimonials();
    } else {
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const loadingToast = toast.loading('Deleting testimonial...');
    const res = await adminFetch(`/admin/testimonials/${id}`, { method: 'DELETE' });
    if (res.success) {
      toast.success('Testimonial deleted', { id: loadingToast });
      fetchTestimonials();
    } else {
      toast.error('Failed to delete testimonial', { id: loadingToast });
    }
  };

  // Counts for the summary bar
  const pending   = testimonials.filter(t => t.status === 'pending').length;
  const approved  = testimonials.filter(t => t.status === 'approved').length;
  const rejected  = testimonials.filter(t => t.status === 'rejected').length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Client Testimonials</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Reviews submitted by clients. Approve them to display on the homepage.
        </p>
      </div>

      {/* SUMMARY CHIPS */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm">
          <span className="text-zinc-400">Total</span>
          <span className="font-black text-white">{testimonials.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-sm">
          <Clock size={14} className="text-amber-400" />
          <span className="text-amber-400 font-semibold">{pending} Pending</span>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl text-sm">
          <CheckCircle size={14} className="text-green-400" />
          <span className="text-green-400 font-semibold">{approved} Approved</span>
        </div>
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm">
          <XCircle size={14} className="text-red-400" />
          <span className="text-red-400 font-semibold">{rejected} Rejected</span>
        </div>
      </div>

      {/* EMPTY STATE */}
      {testimonials.length === 0 ? (
        <div className="text-center py-24 text-zinc-600 border border-zinc-800 rounded-2xl">
          <Quote size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No testimonials submitted yet.</p>
          <p className="text-sm mt-1 text-zinc-700">They will appear here once clients submit reviews.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-zinc-900 border rounded-2xl p-6 transition-all relative ${
                item.status === 'pending'
                  ? 'border-amber-500/40'
                  : item.status === 'rejected'
                  ? 'border-red-500/20'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* ACTIONS */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'approved')}
                      className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'rejected')}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      title="Reject"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}
                {item.status === 'rejected' && (
                  <button
                    onClick={() => handleStatusUpdate(item.id, 'approved')}
                    className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                    title="Re-approve"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                {item.status === 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate(item.id, 'rejected')}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    title="Revoke approval"
                  >
                    <XCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* CLIENT INFO */}
              <div className="flex items-start gap-4 pr-24">
                <div className="size-12 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                  <img
                    src={item.photo || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                    {item.status === 'pending' && (
                      <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 rounded-full">
                        <Clock size={9} /> Pending
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 border border-red-400/30 bg-red-400/10 px-2 py-0.5 rounded-full">
                        Rejected
                      </span>
                    )}
                    {item.status === 'approved' && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">
                        Approved
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm truncate">{item.role}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < item.testimonial?.rating ? "fill-orange-500 text-orange-500" : "text-zinc-700"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* TESTIMONIAL CONTENT */}
              <div className="mt-5 space-y-2 border-t border-zinc-800 pt-4">
                <h4 className="font-semibold text-orange-500 flex items-center gap-2 text-sm">
                  <Quote size={13} />
                  {item.testimonial?.title}
                </h4>
                <p className="text-zinc-300 text-sm italic">"{item.testimonial?.feedback}"</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{item.testimonial?.text}</p>
              </div>

              {/* SUBMITTED DATE */}
              {item.created_at && (
                <p className="mt-4 text-[10px] text-zinc-700 font-mono">
                  Submitted {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}