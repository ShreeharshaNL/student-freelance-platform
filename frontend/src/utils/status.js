// Centralized status helpers for frontend
export const normalizeStatus = (status) => {
  if (!status) return 'in_progress';
  const s = status.toString().toLowerCase();
  if (s === 'in-progress' || s === 'in_progress' || s === 'accepted' || s === 'in progress') return 'in_progress';
  if (s === 'review' || s === 'under_review' || s === 'pending' || s === 'pending_review') return 'under_review';
  if (s === 'completed' || s === 'done' || s === 'finished') return 'completed';
  // fallback: return raw lowercased status
  return s;
};

export const getStatusLabel = (status) => {
  const norm = normalizeStatus(status);
  const labels = {
    in_progress: 'In Progress',
    under_review: 'Under Review',
    completed: 'Completed'
  };
  return labels[norm] || norm.charAt(0).toUpperCase() + norm.slice(1);
};

export const getStatusBadgeClass = (status) => {
  const norm = normalizeStatus(status);
  const classes = {
    in_progress: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    on_hold: 'bg-gray-100 text-gray-800'
  };
  return classes[norm] || 'bg-gray-100 text-gray-800';
};

export default {
  normalizeStatus,
  getStatusLabel,
  getStatusBadgeClass
};
