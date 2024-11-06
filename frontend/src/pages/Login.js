import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Use the configured api instance
import { FaDiscord } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Optional: For better notifications

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleDiscordLogin = () => {
    window.location.href = '/api/auth/discord'; // Use relative path
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      // Assuming the backend returns user data upon successful login
      setUser(res.data.user);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-secondary">
              Or{' '}
              <button
                onClick={handleDiscordLogin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <FaDiscord className="mr-2" /> Login with Discord
              </button>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            {errorMessage && (
              <div className="alert alert-error shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Email address"
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </div>
          </form>
          <div className="text-sm text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
