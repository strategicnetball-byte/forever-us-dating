import React, { useState } from 'react';
import './ReportModal.css';

interface ReportModalProps {
  isOpen: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
  onSubmit: (reportData: any) => Promise<void>;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  userId,
  userName,
  onClose,
  onSubmit
}) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reportTypes = [
    { value: 'inappropriate-photos', label: 'Inappropriate Photos' },
    { value: 'offensive-language', label: 'Offensive Language' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'scam-fraud', label: 'Scam/Fraud' },
    { value: 'fake-profile', label: 'Fake Profile' },
    { value: 'underage', label: 'Underage User' },
    { value: 'explicit-content', label: 'Explicit Content' },
    { value: 'spam', label: 'Spam' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!reportType || !description.trim()) {
      setError('Please select a report type and provide a description');
      setLoading(false);
      return;
    }

    if (description.length < 10) {
      setError('Description must be at least 10 characters');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        reportedUserId: userId,
        reportType,
        description
      });
      setSuccess(true);
      setTimeout(() => {
        setReportType('');
        setDescription('');
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <h2>Report User</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="report-modal-body">
          <p className="report-user-info">
            Reporting: <strong>{userName}</strong>
          </p>

          {success && (
            <div className="alert alert-success">
              ✅ Report submitted successfully. Thank you for helping keep our community safe.
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reportType">Report Type *</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                disabled={loading}
              >
                <option value="">Select a reason...</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about why you're reporting this user..."
                rows={5}
                disabled={loading}
                maxLength={1000}
              />
              <div className="char-count">
                {description.length}/1000
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading || !reportType || !description.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>

          <div className="report-info">
            <p>
              <strong>Note:</strong> All reports are reviewed by our moderation team.
              False reports may result in account restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
