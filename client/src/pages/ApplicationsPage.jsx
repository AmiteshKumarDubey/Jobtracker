import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationForm from '../components/ApplicationForm';
import PriorityBadge from '../components/PriorityBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES  = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const SORTS = [
  { value: 'newest',   label: 'Newest first' },
  { value: 'oldest',   label: 'Oldest first' },
  { value: 'company',  label: 'Company A–Z' },
  { value: 'priority', label: 'Priority' },
];

const STATUS_COLS = ['Applied', 'Interview', 'Offer', 'Rejected'];
const COL_COLORS  = {
  Applied:   'var(--info)',
  Interview: 'var(--warning)',
  Offer:     'var(--success)',
  Rejected:  'var(--danger)',
};

function KanbanCard({ app, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <div
      className="kanban-card"
      onClick={() => navigate(`/applications/${app._id}`)}
    >
      <div className="kanban-card-company">{app.company}</div>
      <div className="kanban-card-role">{app.role}</div>
      {app.location && (
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          📍 {app.location}
        </div>
      )}
      <div className="kanban-card-footer">
        <PriorityBadge priority={app.priority || 'Medium'} />
        <span className="kanban-card-date">{formatDate(app.appliedDate)}</span>
      </div>
      {/* Move status selector */}
      <div
        style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <select
          className="form-control"
          style={{ fontSize: '0.77rem', padding: '0.3rem 0.6rem' }}
          value={app.status}
          onChange={(e) => onEdit({ ...app, status: e.target.value }, true)}
        >
          {STATUS_COLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy]             = useState('newest');
  const [view, setView]                 = useState('table'); // 'table' | 'kanban'
  const [showForm, setShowForm]         = useState(false);
  const [editApp, setEditApp]           = useState(null);
  const [deleteId, setDeleteId]         = useState(null);
  const debounceRef                     = useRef(null);

  const fetchApplications = useCallback(async (searchVal, statusVal) => {
    setLoading(true);
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (statusVal && statusVal !== 'All') params.status = statusVal;
      const res = await api.get('/api/applications', { params });
      setApplications(res.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchApplications(search, statusFilter);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, statusFilter, fetchApplications]);

  // Client-side priority filter + sort
  const filtered = applications
    .filter((a) => priorityFilter === 'All' || a.priority === priorityFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '');
      if (sortBy === 'priority') {
        const rank = { High: 0, Medium: 1, Low: 2 };
        return (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1);
      }
      return 0;
    });

  const handleEdit = (app, quickStatus = false) => {
    if (quickStatus) {
      // Direct status update without opening modal
      api.put(`/api/applications/${app._id}`, { status: app.status })
        .then((res) => {
          setApplications((prev) =>
            prev.map((a) => (a._id === app._id ? res.data.data : a))
          );
          toast.success(`Moved to ${app.status}`);
        })
        .catch((err) => toast.error(getErrorMessage(err)));
      return;
    }
    setEditApp(app);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditApp(null);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/applications/${deleteId}`);
      toast.success('Application deleted');
      setApplications((prev) => prev.filter((a) => a._id !== deleteId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteId(null);
    }
  };

  const handleSaved = (saved) => {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a._id === saved._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
  };

  // Kanban: group by status
  const grouped = STATUS_COLS.reduce((acc, s) => {
    acc[s] = filtered.filter((a) => a.status === s);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            {filtered.length} application{filtered.length !== 1 ? 's' : ''}
            {search || statusFilter !== 'All' ? ' (filtered)' : ''}
          </p>
        </div>
        <div className="page-actions">
          {/* View toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${view === 'table' ? 'active' : ''}`}
              onClick={() => setView('table')}
              title="Table view"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              className={`view-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
              onClick={() => setView('kanban')}
              title="Kanban view"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="18" rx="1" />
                <rect x="13" y="3" width="8" height="11" rx="1" />
                <rect x="13" y="17" width="8" height="4" rx="1" />
              </svg>
              Kanban
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add Application
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="form-control"
            placeholder="Search company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
        </select>
        <select
          className="form-control filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {PRIORITIES.map((p) => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
        </select>
        <select
          className="form-control filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Views */}
      {view === 'table' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <ApplicationTable
            applications={filtered}
            loading={loading}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            showActions
          />
        </div>
      ) : (
        /* Kanban */
        <div className="kanban-board">
          {STATUS_COLS.map((col) => (
            <div key={col} className="kanban-col">
              <div className="kanban-col-header">
                <span
                  className="kanban-col-title"
                  style={{ color: COL_COLORS[col] }}
                >
                  {col}
                </span>
                <span className="kanban-col-count">{grouped[col].length}</span>
              </div>
              <div className="kanban-col-body">
                {grouped[col].length === 0 ? (
                  <div style={{ padding: '1rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No applications
                  </div>
                ) : (
                  grouped[col].map((app) => (
                    <KanbanCard
                      key={app._id}
                      app={app}
                      onEdit={handleEdit}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ApplicationForm
          application={editApp}
          onClose={() => { setShowForm(false); setEditApp(null); }}
          onSaved={handleSaved}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Application"
          message="This will permanently remove the application from your tracker. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
