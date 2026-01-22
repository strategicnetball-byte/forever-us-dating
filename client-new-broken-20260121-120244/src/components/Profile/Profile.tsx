import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.profile.name || '',
    age: user?.profile.age || '',
    bio: user?.profile.bio || '',
    interests: user?.profile.interests?.join(', ') || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/dashboard" className="back-btn">← Back</Link>
        <h1>My Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-primary"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </header>

      <div className="profile-content">
        <div className="profile-photos">
          <div className="photo-grid">
            <div className="photo-slot main-photo">
              <div className="placeholder-photo">📷</div>
              <span>Main Photo</span>
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="photo-slot">
                <div className="placeholder-photo">+</div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h3>Basic Information</h3>
            {isEditing ? (
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="info-display">
                <p><strong>Name:</strong> {user?.profile.name}</p>
                <p><strong>Age:</strong> {user?.profile.age}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>About Me</h3>
            {isEditing ? (
              <textarea
                name="bio"
                placeholder="Tell others about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            ) : (
              <p>{user?.profile.bio || 'No bio added yet.'}</p>
            )}
          </div>

          <div className="info-section">
            <h3>Interests</h3>
            {isEditing ? (
              <input
                type="text"
                name="interests"
                placeholder="Music, Travel, Cooking (comma separated)"
                value={formData.interests}
                onChange={handleChange}
              />
            ) : (
              <div className="interests-display">
                {user?.profile.interests?.length ? (
                  user.profile.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))
                ) : (
                  <p>No interests added yet.</p>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <button onClick={handleSave} className="btn btn-primary save-btn">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;