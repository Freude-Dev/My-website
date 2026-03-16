"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Star, Quote, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch } from '../login/actions';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photo: '',
    status: 'approved',
    testimonial: {
      title: '',
      text: '',
      feedback: '',
      rating: 5
    }
  });

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
    
    try {
      const res = await adminFetch(`/testimonials/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.success) {
        toast.success(`Testimonial ${newStatus}`, { id: loadingToast });
        fetchTestimonials();
      } else {
        toast.error('Failed to update status', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving testimonial...');
    
    try {
      const res = await adminFetch('/testimonials', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        toast.success('Testimonial added!', { id: loadingToast });
        setShowAddModal(false);
        setFormData({
          name: '',
          role: '',
          photo: '',
          status: 'approved',
          testimonial: { title: '', text: '', feedback: '', rating: 5 }
        });
        fetchTestimonials();
      } else {
        toast.error('Failed to save testimonial', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const loadingToast = toast.loading('Deleting testimonial...');
    
    try {
      const res = await adminFetch(`/testimonials/${id}`, { method: 'DELETE' });
      if (res.success) {
        toast.success('Testimonial deleted', { id: loadingToast });
        fetchTestimonials();
      } else {
        toast.error('Failed to delete testimonial', { id: loadingToast });
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
          <h2 className="text-2xl font-bold">Client Testimonials</h2>
          <p className="text-zinc-400 text-sm">Manage reviews. Only approved reviews appear on the homepage.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn bg-orange-600 hover:bg-orange-700 text-white border-none"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testimonials.map((item) => (
          <div key={item._id} className={`bg-zinc-900 border ${item.status === 'pending' ? 'border-orange-500/50' : 'border-zinc-800'} rounded-2xl p-6 hover:border-zinc-700 transition-all relative group`}>
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {item.status === 'pending' && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleStatusUpdate(item._id, 'approved')}
                    className="btn btn-xs btn-success text-white"
                    title="Approve"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(item._id, 'rejected')}
                    className="btn btn-xs btn-error text-white"
                    title="Reject"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              )}
              <button 
                onClick={() => handleDelete(item._id)}
                className="text-zinc-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                <img src={item.photo || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  {item.status === 'pending' && (
                    <span className="badge badge-warning badge-sm gap-1">
                      <Clock size={10} /> Pending
                    </span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="badge badge-error badge-sm">Rejected</span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm">{item.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < item.testimonial.rating ? "fill-orange-500 text-orange-500" : "text-zinc-700"} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-orange-500 flex items-center gap-2">
                <Quote size={14} />
                {item.testimonial.title}
              </h4>
              <p className="text-zinc-300 text-sm italic">"{item.testimonial.feedback}"</p>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.testimonial.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-6">Add New Testimonial</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Client Name</label>
                  <input 
                    type="text" required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Role / Company</label>
                  <input 
                    type="text" required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Photo URL</label>
                <input 
                  type="url"
                  className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                  value={formData.photo}
                  onChange={e => setFormData({...formData, photo: e.target.value})}
                />
              </div>

              <div className="divider opacity-10">Testimonial Content</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Title</label>
                  <input 
                    type="text" required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.testimonial.title}
                    onChange={e => setFormData({...formData, testimonial: { ...formData.testimonial, title: e.target.value }})}
                  />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Rating (1-5)</label>
                  <input 
                    type="number" min="1" max="5" required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.testimonial.rating}
                    onChange={e => setFormData({...formData, testimonial: { ...formData.testimonial, rating: parseInt(e.target.value) }})}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Short Feedback (Italicized)</label>
                <input 
                  type="text" required
                  className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                  value={formData.testimonial.feedback}
                  onChange={e => setFormData({...formData, testimonial: { ...formData.testimonial, feedback: e.target.value }})}
                />
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Full Testimonial Text</label>
                <textarea 
                  required
                  className="textarea bg-zinc-800 border-zinc-700 focus:border-orange-500 h-24"
                  value={formData.testimonial.text}
                  onChange={e => setFormData({...formData, testimonial: { ...formData.testimonial, text: e.target.value }})}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 text-white border-none flex-1">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}