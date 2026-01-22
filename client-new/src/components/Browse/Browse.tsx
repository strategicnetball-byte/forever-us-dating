import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Browse.css';

interface Profile {
  _id: string;
  profile: {
    name: string;
    age: number;
    bio: string;
    photos: string[];
    interests: string[];
    location: string;
  };
  membership: {
    tier: string;
  };
}

const Browse: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/browse', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      setProfiles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;

    try {
      const token = localStorage.getItem('token');
      const likedUserId = profiles[currentIndex]._id;

      const response = await fetch('/api/users/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ likedUserId })
      });

      if (response.ok) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = async () => {
    if (currentIndex >= profiles.length) return;

    try {
      const token = localStorage.getItem('token');
      const passedUserId = profiles[currentIndex]._id;

      const response = await fetch('/api/users/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ passedUserId })
      });

      if (response.ok) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error passing profile:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="browse-loading">Loading profiles...</div>;
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="browse-container">
        <header className="browse-header">
          <button onClick={handleBack} className="btn-back">← Back</button>
          <h1>Browse</h1>
          <div></div>
        </header>
        <div className="browse-empty">
          <h2>No more profiles</h2>
          <p>You've seen all available profiles!</p>
          <button onClick={handleBack} className="btn-primary">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="browse-container">
      <header className="browse-header">
        <button onClick={handleBack} className="btn-back">← Back</button>
        <h1>Browse</h1>
        <div className="profile-counter">{currentIndex + 1} / {profiles.length}</div>
      </header>

      <main className="browse-main">
        <div className="profile-card-large">
          <div className="profile-image">
            {currentProfile.profile.photos && currentProfile.profile.photos.length > 0 ? (
              <img src={currentProfile.profile.photos[0]} alt={currentProfile.profile.name} />
            ) : (
              <div className="placeholder">📷</div>
            )}
          </div>

          <div className="profile-info">
            <h2>{currentProfile.profile.name}, {currentProfile.profile.age}</h2>
            <p className="location">📍 {currentProfile.profile.location}</p>
            <p className="bio">{currentProfile.profile.bio}</p>

            {currentProfile.profile.interests && currentProfile.profile.interests.length > 0 && (
              <div className="interests">
                <h4>Interests:</h4>
                <div className="interest-tags">
                  {currentProfile.profile.interests.map((interest, idx) => (
                    <span key={idx} className="tag">{interest}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="browse-actions">
          <button onClick={handlePass} className="btn-pass">👎 Pass</button>
          <button onClick={handleLike} className="btn-like">❤️ Like</button>
        </div>
      </main>
    </div>
  );
};

export default Browse;
