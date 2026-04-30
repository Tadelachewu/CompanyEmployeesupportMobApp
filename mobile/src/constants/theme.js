import { API_URL } from '@env';

export const COLORS = {
  primary: '#6c5ce7',
  secondary: '#0984e3',
  success: '#00b894',
  warning: '#ffc107',
  danger: '#d63031',
  info: '#17a2b8',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#2d3436',
  textLight: '#636e72',
  border: '#dfe6e9',
};

export const API_BASE = API_URL || 'http://10.0.2.2:3000/api';

export const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'open': return COLORS.info;
    case 'in_progress': return COLORS.warning;
    case 'resolved': return COLORS.success;
    default: return '#6c757d';
  }
};

export const getPriorityColor = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high': return COLORS.danger;
    case 'normal': return COLORS.secondary;
    case 'low': return COLORS.textLight;
    default: return COLORS.textLight;
  }
};
