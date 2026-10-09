import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getErrorMessage } from '../utils/helpers';

const DEFAULT_FORM = {
  company: '',
  role: '',
  status: 'Applied',
  priority: 'Medium',
  location: '',
  jobLink: '',
  appliedDate: new Date().toISOString().split('T')[0],
  followUpDate: '',
  interviewDate: '',
  notes: '',
};

export default function ApplicationForm({ application, onClose, onSaved }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      setForm({
        company:       application.company || '',
        role:          application.role || '',
        status:        application.status || 'Applied',
        priority:      application.priority || 'Medium',
        location:      application.location || '',
        jobLink:       application.jobLink || '',
        appliedDate:   application.appliedDate
          ? new Date(application.appliedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        followUpDate:  application.followUpDate
          ? new Date(application.followUpDate).toISOString().split('T')[0]
          : '',
        interviewDate: application.interviewDate
          ? new Date(application.interviewDate).toISOString().split('T')[0]
          : '',
        notes:         application.notes || '',
      });
    }
  }, [application]);

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (form.jobLink && !/^https?:\/\//i.test(form.jobLink)) {
      errs.jobLink = 'Must start with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      // Clean empty optional fields
      ['jobLink', 'location', 'notes', 'followUpDate', 'interviewDate'].forEach((k) => {
        if (!payload[k]) delete payload[k];
      });

      let res;
      if (application?._id) {
        res = await api.put(`/api/applications/${application._id}`, payload);
        toast.success('Application updated');
      } else {
        res = await api.post('/api/applications', payload);
        toast.success('Application added');
      }
      onSaved(res.data.data);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!application?._id;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>{isEdit ? 'Edit Application' : 'Track New Application'}</h2>
            <p>{isEdit ? 'Update application details' : 'Add a job to your tracker'}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Company + Role */}
          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Company <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                className="form-control"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                autoFocus
              />
              {errors.company && <span className="form-error">{errors.company}</span>}
            </div>
            <div className="form-group">
              <label>Job Title <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                className="form-control"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>
          </div>

          {/* Status + Priority */}
          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                <option value="High">↑ High</option>
                <option value="Medium">→ Medium</option>
                <option value="Low">↓ Low</option>
              </select>
            </div>
          </div>

          {/* Location + Applied Date */}
          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Location</label>
              <input
                className="form-control"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Remote, New York"
              />
            </div>
            <div className="form-group">
              <label>Applied Date</label>
              <input
                type="date"
                className="form-control"
                name="appliedDate"
                value={form.appliedDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Follow-up + Interview date */}
          <div className="form-row form-row-2">
            <div className="form-group">
              <label>Follow-up Date</label>
              <input
                type="date"
                className="form-control"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
              />
              <span className="form-hint">When to follow up on this application</span>
            </div>
            {form.status === 'Interview' && (
              <div className="form-group">
                <label>Interview Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="interviewDate"
                  value={form.interviewDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Job Link */}
          <div className="form-group">
            <label>Job URL</label>
            <input
              className="form-control"
              name="jobLink"
              value={form.jobLink}
              onChange={handleChange}
              placeholder="https://..."
            />
            {errors.jobLink && <span className="form-error">{errors.jobLink}</span>}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              className="form-control"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Recruiter contact, interview info, key requirements…"
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><span className="spinner spinner-sm" /> Saving…</>
              ) : (
                isEdit ? 'Save Changes' : 'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
