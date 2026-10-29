import { useState } from 'react';
import { createRoomType } from '../../api/rooms';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];

const defaultForm = {
  typeName: '',
  code: '',
  description: '',
  maxOccupancy: 2,
  numberOfAdults: 2,
  numberOfChildren: 0,
  baseRate: '',
  status: 'ACTIVE',
  bedType: '',
  numberOfBeds: 1,
  roomSize: '',
};

export default function RoomTypeForm({ onCreated }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = {};
    if (!form.typeName.trim()) next.typeName = 'Room type name is required';
    if (!form.code.trim()) next.code = 'Room type code is required';
    if (form.baseRate === '' || Number(form.baseRate) < 0) next.baseRate = 'Base rate is required';
    if (Number(form.maxOccupancy) < 1) next.maxOccupancy = 'Max occupancy must be at least 1';
    if (
      Number(form.numberOfAdults || 0) + Number(form.numberOfChildren || 0) > Number(form.maxOccupancy || 0)
    ) {
      next.maxOccupancy = 'Adults + children cannot exceed max occupancy';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        typeName: form.typeName.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
        maxOccupancy: Number(form.maxOccupancy),
        numberOfAdults: Number(form.numberOfAdults || 0),
        numberOfChildren: Number(form.numberOfChildren || 0),
        baseRate: Number(form.baseRate),
        status: form.status,
        bedType: form.bedType.trim(),
        numberOfBeds: form.numberOfBeds ? Number(form.numberOfBeds) : null,
        roomSize: form.roomSize.trim(),
      };

      const created = await createRoomType(payload);
      setForm(defaultForm);
      onCreated?.(created);
    } catch (err) {
      setServerError(err?.response?.data?.error || 'Failed to create room type.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card max-w-md rounded-2xl p-4 shadow-xl relative overflow-hidden">
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg font-bold text-amber-500">Add New Room Type</h2>

          {serverError && (
            <p className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs font-semibold text-rose-450">
              {serverError}
            </p>
          )}

          <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Type Name *</label>
          <input
            type="text"
            value={form.typeName}
            onChange={(e) => setForm({ ...form, typeName: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            placeholder="e.g. Deluxe King"
          />
          {errors.typeName && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.typeName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Code *</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm uppercase outline-none transition"
            placeholder="e.g. DLX"
          />
          {errors.code && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            placeholder="Short room description"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Max Occupancy</label>
            <input
              type="number"
              min="1"
              value={form.maxOccupancy}
              onChange={(e) => setForm({ ...form, maxOccupancy: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Base Rate</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.baseRate}
              onChange={(e) => setForm({ ...form, baseRate: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
              placeholder="0.00"
            />
          </div>
        </div>

        {errors.baseRate && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.baseRate}</p>}
        {errors.maxOccupancy && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.maxOccupancy}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Adults</label>
            <input
              type="number"
              min="0"
              value={form.numberOfAdults}
              onChange={(e) => setForm({ ...form, numberOfAdults: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Children</label>
            <input
              type="number"
              min="0"
              value={form.numberOfChildren}
              onChange={(e) => setForm({ ...form, numberOfChildren: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bed Type</label>
            <input
              type="text"
              value={form.bedType}
              onChange={(e) => setForm({ ...form, bedType: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
              placeholder="King / Twin"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Beds</label>
            <input
              type="number"
              min="1"
              value={form.numberOfBeds}
              onChange={(e) => setForm({ ...form, numberOfBeds: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Size</label>
          <input
            type="text"
            value={form.roomSize}
            onChange={(e) => setForm({ ...form, roomSize: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition"
            placeholder="e.g. 35 m²"
          />
        </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-sm outline-none transition cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition"
          >
            {submitting ? 'Creating...' : 'Create Room Type'}
          </button>
        </form>
      </div>
    </div>
  );
}
