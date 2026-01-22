import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.profile.name || '',
    age: user?.profile.age?.toString() || '',
    bio: user?.profile.bio || '',
    interests: user?.profile.interests?.join(', ') || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('photo', file);

      const response = await fetch('/api/users/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Photo uploaded successfully!');
        window.location.reload();
      } else {
        alert('Error: ' + (data.message || 'Failed to upload photo'));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo: ' + error.message);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!window.confirm('Delete this photo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/photo/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Photo deleted successfully!');
        window.location.reload();
      } else {
        alert('Error: ' + (data.message || 'Failed to delete photo'));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo: ' + error.message);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Error: No authentication token found. Please log in again.');
        return;
      }
      
      // Parse interests from comma-separated string
      const interests = formData.interests
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);
      
      const updateData = {
        name: formData.name,
        age: parseInt(formData.age),
        bio: formData.bio,
        interests: interests
      };
      
      console.log('Sending profile update:', updateData);
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        alert(data.message || 'Profile updated successfully!');
        setIsEditing(false);
        // Refresh page to show updated data
        window.location.reload();
      } else {
        alert('Error: ' + (data.message || 'Failed to update profile'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + error.message);
    }
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
            {user?.profile.photos && user.profile.photos.length > 0 ? (
              user.profile.photos.map((photo, index) => (
                <div key={index} className={`photo-slot ${index === 0 ? 'main-photo' : ''}`}>
                  <img src={photo} alt={`Photo ${index + 1}`} className="photo-image" />
                  {isEditing && (
                    <button
                      className="delete-photo-btn"
                      onClick={() => handleDeletePhoto(index)}
                      title="Delete photo"
                    >
                      ✕
                    </button>
                  )}
                  {index === 0 && <span className="main-label">Main Photo</span>}
                </div>
              ))
            ) : (
              <div className="photo-slot main-photo">
                <div className="placeholder-photo">📷</div>
                <span>No photos yet</span>
              </div>
            )}
            {isEditing && user?.profile.photos && user.profile.photos.length < 6 && (
              <div className="photo-slot upload-slot">
                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                >
                  {isUploadingPhoto ? '⏳' : '+'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
            {!isEditing && user?.profile.photos && user.profile.photos.length < 6 && (
              <div className="photo-slot add-photo-slot">
                <div className="placeholder-photo">+</div>
              </div>
            )}
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