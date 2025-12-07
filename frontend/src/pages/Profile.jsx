import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profilePhoto: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://moneymind-1-1jg4.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/login');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({
          ...formData,
          profilePhoto: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://moneymind-1-1jg4.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setUser(formData);
        setIsEditing(false);
        setPhotoPreview('');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    setPhotoPreview('');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Profile</h1>
          <p className="text-gray-300">Manage your account information</p>
        </div>

        <div className="bg-gray-800  p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex justify-center mb-8">
            <div className="relative">
              {photoPreview || user.profilePhoto ? (
                <img
                  src={photoPreview || user.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                  {getInitial(user.name)}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                  <span>📷</span>
                </label>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Name</label>
                <p className="text-gray-100 text-lg">{user.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Email</label>
                <p className="text-gray-100 text-lg">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Phone</label>
                <p className="text-gray-100 text-lg">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Bio</label>
                <p className="text-gray-100 text-lg">{user.bio || 'No bio available'}</p>
              </div>
              <button className="w-full mt-6 p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500 transition-all" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-200 text-sm mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-4">
                <button className="flex-1 p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500 transition-all" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="flex-1 p-3.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-700 transition-all" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;