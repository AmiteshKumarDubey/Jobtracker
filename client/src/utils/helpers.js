import { format, parseISO, isValid, formatDistanceToNow, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(d)) return '—';
    return format(d, 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(d)) return '';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
}

export function getStatusColor(status) {
  const map = {
    Applied: '#3b82f6',
    Interview: '#f59e0b',
    Offer: '#10b981',
    Rejected: '#ef4444',
  };
  return map[status] || '#94a3b8';
}

export function getPriorityColor(priority) {
  const map = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  return map[priority] || '#94a3b8';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

export function getGreeting(name) {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return `Good ${part}${name ? `, ${name.split(' ')[0]}` : ''}`;
}

export function getFollowUpStatus(followUpDate) {
  if (!followUpDate) return null;
  const d = typeof followUpDate === 'string' ? parseISO(followUpDate) : new Date(followUpDate);
  if (!isValid(d)) return null;
  const today = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  if (isBefore(d, today)) return 'overdue';
  if (isAfter(d, todayEnd)) return 'upcoming';
  return 'today';
}

export function groupByMonth(applications) {
  const map = {};
  applications.forEach((app) => {
    if (!app.appliedDate) return;
    try {
      const d = typeof app.appliedDate === 'string' ? parseISO(app.appliedDate) : new Date(app.appliedDate);
      if (!isValid(d)) return;
      const key = format(d, 'MMM yyyy');
      map[key] = (map[key] || 0) + 1;
    } catch { /* skip */ }
  });
  // Return sorted array of { month, count }
  return Object.entries(map)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const da = new Date(a.month);
      const db = new Date(b.month);
      return da - db;
    });
}

export function truncate(str, len = 30) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '…' : str;
}

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    'Something went wrong'
  );
}
