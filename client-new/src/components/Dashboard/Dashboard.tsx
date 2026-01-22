import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ReportModal from '../ReportModal/ReportModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [vipScoreFilter, setVipScoreFilter] = useState({
    minScore: 0,
    maxScore: 100
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState<any>(null);

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

  const handleSubmitReport = async (reportData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit report');
      }

      console.log('Report submitted successfully');
    } catch (error: any) {
      throw error;
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

      <ReportModal
        isOpen={showReportModal}
        userId={reportingUser?._id}
        userName={reportingUser?.profile?.name}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default Dashboard;