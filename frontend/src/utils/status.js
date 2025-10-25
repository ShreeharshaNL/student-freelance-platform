// Centralized status helpers for frontend
export const normalizeStatus = (status) => {
  // Default to 'pending' when status is missing
  if (!status && status !== 0) return 'pending';

  const s = status.toString().toLowerCase().trim();

  // Map various string forms to canonical statuses used in the UI
  if (['in-progress', 'in_progress', 'in progress'].includes(s)) {
    return 'in_progress';
  }

  if (['under_review', 'under-review', 'review', 'pending_review'].includes(s)) {
    return 'under_review';
  }

  if (['changes_requested', 'changes-requested', 'change_requested', 'change-requested'].includes(s)) {
    return 'changes_requested';
  }

  if (['completed', 'done', 'finished'].includes(s)) {
    return 'completed';
  }

  if (s === 'rejected') return 'rejected';
  if (s === 'pending') return 'pending';
  if (s === 'accepted') return 'accepted';

  // Fallback to raw normalized string
  return s;
};

export const getStatusLabel = (status) => {
  const norm = normalizeStatus(status);
  const labels = {
    in_progress: 'In Progress',
    under_review: 'Under Review',
    completed: 'Completed',
    changes_requested: 'Changes Requested',
    rejected: 'Rejected',
    accepted: 'Accepted',
    pending: 'Pending'
  };
  return labels[norm] || norm.charAt(0).toUpperCase() + norm.slice(1);
};

export const getStatusBadgeClass = (status) => {
  const norm = normalizeStatus(status);
  const classes = {
    in_progress: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    changes_requested: 'bg-orange-100 text-orange-800',
    rejected: 'bg-red-100 text-red-800',
    accepted: 'bg-blue-50 text-blue-800',
    pending: 'bg-gray-100 text-gray-800',
    on_hold: 'bg-gray-100 text-gray-800'
  };
  return classes[norm] || 'bg-gray-100 text-gray-800';
};

export default {
  normalizeStatus,
  getStatusLabel,
  getStatusBadgeClass
};
