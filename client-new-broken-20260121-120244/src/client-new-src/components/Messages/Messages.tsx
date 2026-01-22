import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Messages.css';

const Messages: React.FC = () => {
  const { user } = useAuth();

  // Mock data for now
  const matches = [
    { id: '1', name: 'Sarah', lastMessage: 'Hey! How are you?', time: '2m ago', unread: true },
    { id: '2', name: 'Emma', lastMessage: 'Thanks for the match!', time: '1h ago', unread: false },
    { id: '3', name: 'Jessica', lastMessage: 'Would love to chat more', time: '3h ago', unread: false },
  ];

  return (
    <div className="messages-page">
      <header className="messages-header">
        <Link to="/dashboard" className="back-btn">← Back</Link>
        <h1>Messages</h1>
        <div></div>
      </header>

      <div className="messages-content">
        <div className="matches-list">
          <h3>Your Matches</h3>
          {matches.length > 0 ? (
            <div className="matches-grid">
              {matches.map(match => (
                <div key={match.id} className={`match-item ${match.unread ? 'unread' : ''}`}>
                  <div className="match-avatar">
                    <div className="avatar-placeholder">
                      {match.name.charAt(0)}
                    </div>
                  </div>
                  <div className="match-info">
                    <h4>{match.name}</h4>
                    <p>{match.lastMessage}</p>
                    <span className="time">{match.time}</span>
                  </div>
                  {match.unread && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-matches">
              <div className="no-matches-icon">💬</div>
              <h3>No matches yet</h3>
              <p>Start swiping to find your perfect match!</p>
              <Link to="/dashboard" className="btn btn-primary">
                Discover People
              </Link>
            </div>
          )}
        </div>

        <div className="chat-area">
          <div className="chat-placeholder">
            <div className="chat-icon">💌</div>
            <h3>Select a match to start chatting</h3>
            <p>Your conversations will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;