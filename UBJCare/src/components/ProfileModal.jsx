import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Camera } from 'lucide-react';
import supabase from '../supabaseClient';

function ProfileModal({ user, onClose }) {
  const [profile, setProfile] = useState({ name: '', phone: '', profile_photo_url: '' });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, phone, profile_photo_url')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('Kesalahan Mengambil Profil:', error);
        setError('Gagal mengambil profil.');
      } else {
        setProfile(data || { name: user.user_metadata.name, phone: user.user_metadata.phone || '', profile_photo_url: '' });
      }
    } catch (err) {
      console.error('Kesalahan Pengambilan Tidak Terduga:', err);
      setError('Terjadi kesalahan tak terduga saat mengambil profil.');
    }
  };

  const handlePhotoChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' && file.size <= 5 * 1024 * 1024) {
        setPhoto(file);
      } else {
        setError('Harap unggah gambar JPG dengan ukuran kurang dari 5MB.');
        setPhoto(null);
      }
    }
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let photoUrl = profile.profile_photo_url;
      if (photo) {
        const filePath = `public/${user.id}/profile_${Date.now()}.jpg`;
        const { data, error: uploadError } = await supabase.storage
          .from('dbimg')
          .upload(filePath, photo, { contentType: 'image/jpeg' });
        if (uploadError) throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);
        photoUrl = supabase.storage.from('dbimg').getPublicUrl(filePath).data.publicUrl;
      }

      const updates = {
        user_id: user.id,
        name: profile.name,
        phone: profile.phone,
        profile_photo_url: photoUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'user_id' });

      if (upsertError) throw upsertError;

      await supabase.auth.updateUser({
        data: { name: profile.name, phone: profile.phone }
      });

      setPhoto(null);
      showToast('Profil berhasil diperbarui!', 'success');
      fetchProfile();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui profil.');
      console.error('Kesalahan Pembaruan Profil:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast.show && (
        <div className={`p-3 rounded-lg text-white text-sm mb-4 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt="Profil"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Foto Profil
            </label>
            <input
              type="file"
              accept="image/jpeg"
              onChange={handlePhotoChange}
              className="w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:sm:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              disabled={loading}
            />
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nama Lengkap
          </label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-gray-50 text-gray-800 rounded-lg p-3 text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Nomor Telepon
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor telepon Anda"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full bg-gray-50 text-gray-800 rounded-lg p-3 text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Alamat Email
          </label>
          <input
            type="email"
            value={user.email}
            className="w-full bg-gray-100 text-gray-600 rounded-lg p-3 text-sm border cursor-not-allowed"
            disabled
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className={`flex-1 bg-green-500 text-white rounded-lg p-3 text-sm font-medium hover:bg-green-600 disabled:bg-green-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Memperbarui...' : 'Perbarui Profil'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileModal;