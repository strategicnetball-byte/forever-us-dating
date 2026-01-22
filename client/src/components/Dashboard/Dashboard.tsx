import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

interface ReportData {
  reportedUserId: string;
  reportType: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [vipScoreFilter, setVipScoreFilter] = useState({
    minScore: 0,
    maxScore: 100
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState<any>(null);
  const [reportType, setReportType] = useState('inappropriate-photos');
  const [reportDescription, setReportDescription] = useState('');

  const handleScoreFilterChange = (field: 'minScore' | 'maxScore', value: number) => {
    setVipScoreFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReportUser = (userToReport: any) => {
    setReportingUser(userToReport);
    setShowReportModal(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingUser || !reportDescription.trim()) {
      alert('Please provide a description');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reportedUserId: reportingUser._id,
          reportType: reportType,
          description: reportDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      alert('Report submitted successfully');
      setShowReportModal(false);
      setReportDescription('');
      setReportType('inappropriate-photos');
    } catch (error) {
      alert('Error submitting report');
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Forever Us</h1>
        <div className="header-actions">
          <Link to="/profile" className="btn btn-secondary">Profile</Link>
          <Link to="/messages" className="btn btn-secondary">Messages</Link>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user?.profile.name}!</h2>
          <p>Ready to find your perfect match?</p>
        </div>
        
        <div className="discover-section">
          <div className="card-stack">
            <div className="profile-card">
              <div className="card-image">
                <div className="placeholder-image">📷</div>
              </div>
              <div className="card-info">
                <h3>Start Discovering</h3>
                <p>Swipe through profiles to find your match</p>
              </div>
              <div className="card-actions">
                <button className="btn-pass">👎 Pass</button>
                <button className="btn-like">❤️ Like</button>
                <button 
                  className="btn-report"
                  onClick={() => handleReportUser({ _id: 'user-id', profile: { name: 'User' } })}
                  title="Report this user"
                >
                  🚩 Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Score Filter Section */}
        {user?.membership?.tier === 'vip' && (
          <div className="vip-filter-section">
            <h3>VIP Score Filter</h3>
            <div className="filter-controls">
              <div className="filter-input-group">
                <label htmlFor="min-score">
                  <span>0</span>
                </label>
                <input
                  id="min-score"
                  type="range"
                  min="0"
                  max="100"
                  value={vipScoreFilter.minScore}
                  onChange={(e) => handleScoreFilterChange('minScore', parseInt(e.target.value))}
                  className="score-slider"
                />
              </div>
              <div className="filter-input-group">
                <label htmlFor="max-score">
                  <span>100</span>
                </label>
                <input
                  id="max-score"
                  type="range"
                  min="0"
                  max="100"
                  value={vipScoreFilter.maxScore}
                  onChange={(e) => handleScoreFilterChange('maxScore', parseInt(e.target.value))}
                  className="score-slider"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="quick-stats">
          <div className="stat-card">
            <h3>100</h3>
            <p>Matches</p>
          </div>
          <div className="stat-card">
            <h3>100</h3>
            <p>Likes</p>
          </div>
          <div className="stat-card">
            <h3>100</h3>
            <p>Messages</p>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Report User</h2>
            <p>Reporting: {reportingUser?.profile?.name}</p>
            
            <div className="form-group">
              <label>Report Type:</label>
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="inappropriate-photos">Inappropriate Photos</option>
                <option value="offensive-language">Offensive Language</option>
                <option value="harassment">Harassment</option>
                <option value="scam-fraud">Scam/Fraud</option>
                <option value="fake-profile">Fake Profile</option>
                <option value="underage">Underage</option>
                <option value="explicit-content">Explicit Content</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea 
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe the issue..."
                rows={4}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowReportModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleSubmitReport} className="btn-submit">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;