import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

import supabase from '../supabaseClient';

export default function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Nama lengkap wajib diisi';
    if (!email) newErrors.email = 'Email wajib diisi';
    if (!password) newErrors.password = 'Kata sandi wajib diisi';
    if (password && password.length < 6) newErrors.password = 'Kata sandi harus minimal 6 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Harap isi semua kolom wajib dengan benar');
      return;
    }
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'user' } },
      });
      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Email sudah terdaftar');
        }
        throw error;
      }

      const profileData = {
        user_id: data.user.id,
        name,
      };
      if (phone) profileData.phone = phone;

      const { error: profileError } = await supabase.from('profiles').insert(profileData);

      if (profileError) throw profileError;

      setUser(data.user);
      showToast('Pendaftaran berhasil! Silakan cek email Anda untuk memverifikasi akun.', 'success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Error saat pendaftaran:', err.message);
      showToast(err.message || 'Pendaftaran gagal!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 font-montserrat">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white text-sm animate-slide-in max-w-sm z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-xl shadow-[10px_10px_0px_0px_#2d3748] flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 relative hidden md:block">
          <a href="#" className="absolute top-4 left-4 text-slate-50 text-2xl font-bold z-10">UBJ-CARE</a>
          <a
            href="/"
            className="absolute top-4 right-4 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200 z-10"
          >
            Kembali ke Beranda →
          </a>
          <div className="relative h-full">
            <img
              src="https://i.ibb.co/Z604TcdM/Whats-App-Image-2025-07-25-at-01-30-33.jpg"
              alt=" "
              className="w-full h-full object-cover opacity-100"
              onError={(e) => {
                e.target.style.display = 'none';
                console.log('Gambar gagal dimuat');
              }}
            />
            <div className="absolute inset-0 bg-gray-800/50"></div>
            <div className="absolute bottom-8 left-8 text-slate-50">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Lapor Hari Ini</h2>
              <h2 className="text-xl md:text-2xl font-bold">Selesaikan Besok</h2>
              <div className="flex gap-2 mt-4">
                <div className="w-3 h-1 bg-gray-300 rounded"></div>
                <div className="w-3 h-1 bg-gray-300 rounded"></div>
                <div className="w-3 h-1 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white">
          <div className="max-w-xl mx-auto">
            <h1 className="text-gray-900 text-xl sm:text-2xl font-extrabold mb-2">Buat Akun</h1>
            <p className="text-gray-600 mb-6 text-sm font-medium">
              Sudah punya akun?{' '}
              <a href="/login" className="text-green-500 hover:underline font-medium">
                Masuk
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-700 text-xs mb-1 block">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${
                    errors.name ? 'border border-red-500' : ''
                  }`}
                  required
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${
                    errors.email ? 'border border-red-500' : ''
                  }`}
                  required
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1 block">Kata Sandi</label>
                <input
                  type="password"
                  placeholder="Masukkan kata sandi Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${
                    errors.password ? 'border border-red-500' : ''
                  }`}
                  required
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1 block">Telepon (Opsional)</label>
                <input
                  type="text"
                  placeholder="Masukkan nomor telepon Anda"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white rounded-md p-3 text-sm hover:bg-green-600 disabled:bg-green-400 transition-colors duration-200 flex items-center justify-center font-normal font-medium"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                    />
                  </svg>
                ) : null}
                {isLoading ? 'Mendaftar...' : 'Buat Akun'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}