import React, { useState } from 'react';

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'User',
    avatar: 'https://via.placeholder.com/150',
  });

  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    setUser(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setEditMode(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl transition-all">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative group">
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
            <span className="text-sm">Change</span>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="text-sm text-indigo-600 bg-indigo-100 px-2 py-1 rounded mt-1 inline-block">
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editMode}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editMode}
        />
        <InputField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {editMode ? (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Update
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, disabled, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      />
    </div>
  );
}
