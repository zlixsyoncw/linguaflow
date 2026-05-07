import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { GraduationCap, ArrowRight } from 'lucide-react';

interface AuthFormsProps {
  onLogin: (user: User) => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Please enter email and password.');
        return;
      }
    }

    // Simulate API call and login
    const user: User = {
      email: formData.email,
      firstName: isRegistering ? formData.firstName : 'Demo',
      lastName: isRegistering ? formData.lastName : 'User',
      phone: formData.phone,
    };
    
    // In a real app, we would validate against a backend here
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">LinguaFlow AI</h1>
          <p className="text-slate-500 text-center mt-2">
            {isRegistering ? 'Create your student account' : 'Welcome back, learner!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          {isRegistering && (
             <Input
             label="Phone (Optional)"
             type="tel"
             name="phone"
             placeholder="+1 (555) 000-0000"
             value={formData.phone}
             onChange={handleChange}
           />
          )}

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          {isRegistering && (
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-6" variant="primary">
            {isRegistering ? 'Sign Up' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};