import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import { formatDate, getFollowUpStatus } from '../utils/helpers';

function FollowUpIndicator({ date }) {
  const status = getFollowUpStatus(date);
  if (!status) return <span style={{ color: 'var(--text-muted)' }}>—</span>;
  const cls = `badge badge-${status}`;
  const labels = { overdue: 'Overdue', today: 'Today', upcoming: formatDate(date) };
  return <span className={cls}>{labels[status]}</span>;
}

export default function ApplicationTable({
  applications,
  loading,
  onEdit,
  onDelete,
  onView,
  showActions = true,
}) {
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No applications found"
        message="Add your first job application to get started tracking your job search."
        action={
          onEdit && (
            <button className="btn btn-primary btn-sm" onClick={() => onEdit(null)}>
              + Add Application
            </button>
          )
        }
      />
    );
  }

  const handleRowClick = (appId) => {
    navigate(`/applications/${appId}`);
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Applied Date</th>
            <th>Follow-up</th>
            {showActions && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app._id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(app._id)}
            >
              <td className="td-primary">{app.company}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{app.role}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <StatusBadge status={app.status} />
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <PriorityBadge priority={app.priority || 'Medium'} />
              </td>
              <td className="td-muted">{formatDate(app.appliedDate)}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <FollowUpIndicator date={app.followUpDate} />
              </td>
              {showActions && (
                <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-icon"
                      onClick={() => onEdit(app)}
                      title="Edit"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => onDelete(app._id)}
                      title="Delete"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
