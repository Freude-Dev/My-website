"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Briefcase, Edit3, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch } from '../login/actions';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    subservices: [''],
    prices: [0]
  });

  const fetchServices = async () => {
    const result = await adminFetch('/services');
    if (result.success) {
      setServices(result.data);
    } else {
      toast.error('Failed to load services');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', image: '', description: '', subservices: [''], prices: [0] });
    setShowModal(true);
  };

  const handleOpenEdit = (service: any) => {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      image: service.image,
      description: service.description,
      subservices: service.subservices.length > 0 ? service.subservices : [''],
      prices: service.prices.length > 0 ? service.prices : [0]
    });
    setShowModal(true);
  };

  const handleAddSubservice = () => {
    setFormData({
      ...formData,
      subservices: [...formData.subservices, ''],
      prices: [...formData.prices, 0]
    });
  };

  const handleRemoveSubservice = (index: number) => {
    const newSubs = [...formData.subservices];
    const newPrices = [...formData.prices];
    newSubs.splice(index, 1);
    newPrices.splice(index, 1);
    setFormData({ ...formData, subservices: newSubs, prices: newPrices });
  };

  const handleSubserviceChange = (index: number, value: string) => {
    const newSubs = [...formData.subservices];
    newSubs[index] = value;
    setFormData({ ...formData, subservices: newSubs });
  };

  const handlePriceChange = (index: number, value: string) => {
    const newPrices = [...formData.prices];
    newPrices[index] = parseInt(value) || 0;
    setFormData({ ...formData, prices: newPrices });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? 'Updating service...' : 'Saving service...');
    
    const url = editingId 
      ? `/services/${editingId}` 
      : '/services';
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      if (res.success) {
        toast.success(editingId ? 'Service updated!' : 'Service added!', { id: loadingToast });
        setShowModal(false);
        fetchServices();
      } else {
        toast.error(res.message || 'Failed to save service', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const loadingToast = toast.loading('Deleting service...');
    
    try {
      const res = await adminFetch(`/services/${id}`, { method: 'DELETE' });
      if (res.success) {
        toast.success('Service deleted', { id: loadingToast });
        fetchServices();
      } else {
        toast.error('Failed to delete service', { id: loadingToast });
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
          <h2 className="text-2xl font-bold">Service Offerings</h2>
          <p className="text-zinc-400 text-sm">Manage your core services and their detailed pricing.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="btn bg-orange-600 hover:bg-orange-700 text-white border-none"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:border-zinc-700 transition-all">
            <div className="w-full md:w-64 h-48 md:h-auto relative">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent md:hidden"></div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(service)}
                    className="btn btn-sm btn-ghost text-zinc-400 hover:text-orange-500"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service._id)} 
                    className="btn btn-sm btn-ghost text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-auto">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Subservices & Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {service.subservices.map((sub: string, i: number) => (
                    <div key={i} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-orange-500" />
                        <span className="text-sm text-zinc-300">{sub}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-400">{service.prices[i]} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Service Name</label>
                  <input 
                    type="text" required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Image URL</label>
                  <input 
                    type="url" required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Description</label>
                <textarea 
                  required
                  className="textarea bg-zinc-800 border-zinc-700 focus:border-orange-500 h-20"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Subservices & Prices</label>
                  <button type="button" onClick={handleAddSubservice} className="btn btn-xs btn-ghost text-orange-500">
                    <Plus size={14} /> Add Row
                  </button>
                </div>
                
                {formData.subservices.map((_, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input 
                      type="text" placeholder="Subservice name" required
                      className="input input-sm flex-1 bg-zinc-800 border-zinc-700 focus:border-orange-500"
                      value={formData.subservices[index]}
                      onChange={e => handleSubserviceChange(index, e.target.value)}
                    />
                    <input 
                      type="number" placeholder="Price" required
                      className="input input-sm w-32 bg-zinc-800 border-zinc-700 focus:border-orange-500"
                      value={formData.prices[index]}
                      onChange={e => handlePriceChange(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSubservice(index)}
                      disabled={formData.subservices.length === 1}
                      className="btn btn-sm btn-ghost text-zinc-500 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 text-white border-none flex-1">
                  {editingId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}