import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center">Create your account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
          <input
            type="text"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          <p className="text-center">
            Already have an account? <Link to="/login" className="text-primary-600">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
