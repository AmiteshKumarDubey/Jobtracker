import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ApplicationForm from '../components/ApplicationForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, formatRelativeDate, getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

function DetailItem({ label, value, children }) {
  return (
    <div className="detail-item">
      <span className="detail-item-label">{label}</span>
      <span className="detail-item-value">{children || value || '—'}</span>
    </div>
  );
}

function TimelineItem({ label, date, secondary }) {
  return (
    <div className="timeline-item">
      <div className={`timeline-dot${secondary ? ' timeline-dot-secondary' : ''}`} />
      <div className="timeline-content">
        <div className="timeline-label">{label}</div>
        <div className="timeline-date">{formatDate(date)} · {formatRelativeDate(date)}</div>
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [app, setApp]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving]     = useState(false);

  // Checklist state
  const [checkItems, setCheckItems] = useState([]);
  const [newItem, setNewItem]       = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [notesDirty, setNotesDirty] = useState(false);

  const fetchApp = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/applications/${id}`);
      const data = res.data.data;
      setApp(data);
      setCheckItems(data.preparationChecklist || []);
      setInterviewNotes(data.interviewNotes || '');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchApp(); }, [fetchApp]);

  const handleSaved = (saved) => {
    setApp(saved);
    setCheckItems(saved.preparationChecklist || []);
    setInterviewNotes(saved.interviewNotes || '');
    setShowEdit(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/applications/${id}`);
      toast.success('Application deleted');
      navigate('/applications');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/api/applications/${id}`, { status: newStatus });
      setApp(res.data.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCheckToggle = async (idx) => {
    const updated = checkItems.map((item, i) =>
      i === idx ? { ...item, done: !item.done } : item
    );
    setCheckItems(updated);
    try {
      await api.put(`/api/applications/${id}`, { preparationChecklist: updated });
    } catch {
      // revert
      setCheckItems(checkItems);
    }
  };

  const handleAddCheckItem = async () => {
    if (!newItem.trim()) return;
    const updated = [...checkItems, { text: newItem.trim(), done: false }];
    setCheckItems(updated);
    setNewItem('');
    try {
      await api.put(`/api/applications/${id}`, { preparationChecklist: updated });
    } catch {
      setCheckItems(checkItems);
    }
  };

  const handleRemoveCheckItem = async (idx) => {
    const updated = checkItems.filter((_, i) => i !== idx);
    setCheckItems(updated);
    try {
      await api.put(`/api/applications/${id}`, { preparationChecklist: updated });
    } catch {
      setCheckItems(checkItems);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/api/applications/${id}`, { interviewNotes });
      setApp(res.data.data);
      setNotesDirty(false);
      toast.success('Notes saved');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return (
    <div style={{ padding: '2rem', color: 'var(--danger)' }}>
      {error} — <Link to="/applications" style={{ color: 'var(--primary-light)' }}>Go back</Link>
    </div>
  );
  if (!app) return null;

  const isInterview = app.status === 'Interview';

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Back */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/applications')}
        >
          ← Back to Applications
        </button>
      </div>

      {/* Hero */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="detail-hero">
          <div className="detail-company-logo">🏢</div>
          <div className="detail-hero-content">
            <div className="detail-company-name">{app.company}</div>
            <div className="detail-role">{app.role}</div>
            <div className="detail-badges">
              {/* Inline status change */}
              <select
                className="form-control"
                style={{
                  width: 'auto',
                  padding: '0.2rem 1.75rem 0.2rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'var(--info-bg)',
                  border: '1px solid var(--info-border)',
                  color: '#60a5fa',
                  borderRadius: 100,
                }}
                value={app.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {['Applied', 'Interview', 'Offer', 'Rejected'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <PriorityBadge priority={app.priority || 'Medium'} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)}>
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowDelete(true)}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* Details grid */}
        <hr className="divider" />
        <div className="detail-grid">
          <DetailItem label="Location">
            {app.location ? `📍 ${app.location}` : '—'}
          </DetailItem>
          <DetailItem label="Applied Date">
            📅 {formatDate(app.appliedDate)}
          </DetailItem>
          <DetailItem label="Follow-up Date">
            {app.followUpDate ? `📆 ${formatDate(app.followUpDate)}` : '—'}
          </DetailItem>
          <DetailItem label="Job Link">
            {app.jobLink ? (
              <a
                href={app.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary-light)' }}
              >
                View Job Posting ↗
              </a>
            ) : '—'}
          </DetailItem>
          {isInterview && (
            <DetailItem label="Interview Date">
              {app.interviewDate ? `🗓 ${formatDate(app.interviewDate)}` : '—'}
            </DetailItem>
          )}
        </div>

        {/* Notes */}
        {app.notes && (
          <>
            <hr className="divider" />
            <div>
              <div className="detail-item-label" style={{ marginBottom: '0.5rem' }}>Notes</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {app.notes}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Interview prep — only for Interview status */}
      {isInterview && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="section-header">
            <span className="section-title">🎯 Interview Preparation</span>
          </div>

          {/* Interview notes */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label>Interview Notes</label>
              <textarea
                className="form-control"
                rows={4}
                value={interviewNotes}
                onChange={(e) => { setInterviewNotes(e.target.value); setNotesDirty(true); }}
                placeholder="Key topics to review, questions to prepare, company research…"
              />
            </div>
            {notesDirty && (
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.5rem' }}
                onClick={handleSaveNotes}
                disabled={saving}
              >
                {saving ? <><span className="spinner spinner-xs" /> Saving…</> : 'Save Notes'}
              </button>
            )}
          </div>

          {/* Prep checklist */}
          <div>
            <div className="detail-item-label" style={{ marginBottom: '0.65rem' }}>
              Preparation Checklist ({checkItems.filter((c) => c.done).length}/{checkItems.length})
            </div>

            {checkItems.length > 0 && (
              <div className="checklist" style={{ marginBottom: '0.75rem' }}>
                {checkItems.map((item, idx) => (
                  <div key={idx} className="checklist-item">
                    <input
                      type="checkbox"
                      className="checklist-checkbox"
                      checked={item.done}
                      onChange={() => handleCheckToggle(idx)}
                    />
                    <span className={`checklist-text${item.done ? ' done' : ''}`}>
                      {item.text}
                    </span>
                    <button
                      className="btn-icon"
                      onClick={() => handleRemoveCheckItem(idx)}
                      title="Remove"
                      style={{ opacity: 0.5, fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-control"
                placeholder="Add a checklist item…"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCheckItem()}
                style={{ fontSize: '0.83rem' }}
              />
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleAddCheckItem}
                disabled={!newItem.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity timeline */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Activity</span>
        </div>
        <div className="timeline">
          {app.updatedAt && app.updatedAt !== app.createdAt && (
            <TimelineItem label="Last updated" date={app.updatedAt} secondary />
          )}
          {isInterview && app.interviewDate && (
            <TimelineItem label="Interview scheduled" date={app.interviewDate} />
          )}
          {app.followUpDate && (
            <TimelineItem label="Follow-up date" date={app.followUpDate} secondary />
          )}
          <TimelineItem label="Application submitted" date={app.appliedDate} />
          <TimelineItem label="Added to tracker" date={app.createdAt} secondary />
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <ApplicationForm
          application={app}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirm */}
      {showDelete && (
        <ConfirmDialog
          title="Delete Application"
          message={`Remove ${app.company} – ${app.role} from your tracker? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
