'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { Toast } from '@/types';

const ICONS: Record<string, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      className={`toast ${toast.type}`}
      role="alert"
      onClick={() => onRemove(toast.id)}
      style={{ cursor: 'pointer' }}
    >
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <div className="toast-content">
        <p className="toast-title" style={{ textTransform: 'capitalize' }}>{toast.type}</p>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss"
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '1rem',
          padding: '0 4px',
          alignSelf: 'flex-start',
        }}
      >
        ×
      </button>
    </div>
  );
}
