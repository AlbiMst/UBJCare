import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, TrendingUp, LogOut, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import supabase from '../supabaseClient';
import Sidebar from './Sidebar';
import Modal from './Modal';

function ProgressUpdateForm({ complaintId, user, onUpdateSubmitted, onCancel }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg' && file.size <= 5 * 1024 * 1024) {
        setImage(file);
      } else {
        setError('Harap unggah gambar JPG dengan ukuran kurang dari 5MB.');
        setImage(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!description) {
      setError('Deskripsi diperlukan.');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const filePath = `public/${user.id}/progress_${Date.now()}.jpg`;
        const { data, error: uploadError } = await supabase.storage
          .from('dbimg')
          .upload(filePath, image, { contentType: 'image/jpeg' });
        if (uploadError) throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);
        imageUrl = supabase.storage.from('dbimg').getPublicUrl(filePath).data.publicUrl;
      }

      const { error: insertError } = await supabase.from('progress_updates').insert({
        complaint_id: complaintId,
        description,
        image_url: imageUrl,
        created_by: user.id,
        created_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setDescription('');
      setImage(null);
      onUpdateSubmitted();
      onCancel();
    } catch (err) {
      setError(err.message || 'Gagal mengirim pembaruan progres.');
      console.error('Kesalahan Pengiriman:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <textarea
        placeholder="Deskripsi Progres"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-gray-50 text-gray-800 rounded-md p-3 text-sm border focus:outline-none focus:ring-2 focus:ring-green-600"
        disabled={loading}
        rows="3"
      />
      <input
        type="file"
        accept="image/jpeg"
        onChange={handleImageChange}
        className="w-full p-2 border rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-green-50 file:text-green-600 hover:file:bg-green-100"
        disabled={loading}
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleSubmit}
          className={`flex-1 bg-green-600 text-white rounded-md p-2 text-sm font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim Pembaruan'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showProgressForm, setShowProgressForm] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [expandedUpdates, setExpandedUpdates] = useState({});
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Kesalahan Penyegaran Sesi:', error);
          setError('Gagal menyegarkan sesi. Silakan masuk kembali.');
          setLoading(false);
          return;
        }
        if (!data.session) {
          setError('Tidak ada sesi aktif. Mengarahkan ke halaman masuk...');
          setTimeout(() => navigate('/login'), 2000);
          setLoading(false);
          return;
        }
        if (activeTab === 'complaints') {
          fetchComplaints();
        } else if (activeTab === 'users') {
          fetchUsers();
        }
      } catch (err) {
        console.error('Kesalahan Sesi Tidak Terduga:', err);
        setError('Terjadi kesalahan tak terduga saat menyegarkan sesi.');
        setLoading(false);
      }
    };

    refreshSession();
  }, [navigate, activeTab]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          progress_updates(id, description, image_url, created_at),
          profiles!user_id(name)
        `)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Kesalahan Mengambil Pengaduan:', error);
        setError(`Gagal mengambil pengaduan: ${error.message}`);
        setComplaints([]);
      } else {
        setComplaints(data || []);
        const total = data?.length || 0;
        const pending = data?.filter(c => c.status === 'pending').length || 0;
        const inProgress = data?.filter(c => c.status === 'in_progress').length || 0;
        const resolved = data?.filter(c => c.status === 'resolved').length || 0;
        setStats({ total, pending, inProgress, resolved });
        setError('');
      }
    } catch (err) {
      console.error('Kesalahan Pengambilan Tidak Terduga:', err);
      setError('Terjadi kesalahan tak terduga saat mengambil pengaduan.');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, phone, profile_photo_url')
        .order('name', { ascending: true });
      if (error) {
        console.error('Kesalahan Mengambil Pengguna:', error);
        setError(`Gagal mengambil daftar pengguna: ${error.message}`);
        setUsers([]);
      } else {
        const formattedData = data.map(user => ({
          user_id: user.user_id,
          name: user.name || 'Tidak diketahui',
          phone: user.phone || 'Tidak tersedia',
          profile_photo_url: user.profile_photo_url
        }));
        setUsers(formattedData || []);
        setError('');
      }
    } catch (err) {
      console.error('Kesalahan Pengambilan Tidak Terduga:', err);
      setError('Terjadi kesalahan tak terduga saat mengambil daftar pengguna.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        console.error('Kesalahan Perbarui Status:', error);
        setError(`Gagal memperbarui status: ${error.message}`);
      } else {
        fetchComplaints();
      }
    } catch (err) {
      console.error('Kesalahan Perbarui Tidak Terduga:', err);
      setError('Terjadi kesalahan tak terduga saat memperbarui status.');
    }
  };

  const handleStatusChange = async (complaintId, e) => {
    const newStatus = e.target.value;
    
    if (newStatus === 'add_progress') {
      setShowProgressForm(complaintId);
      return;
    }
    
    await updateComplaintStatus(complaintId, newStatus);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleUpdateExpansion = (id) => {
    setExpandedUpdates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (complaint.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    activeTab === 'complaints' ? filteredComplaints.length / itemsPerPage : filteredUsers.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(
    currentPage * itemsPerPage,
    activeTab === 'complaints' ? filteredComplaints.length : filteredUsers.length
  );

  const paginatedItems = activeTab === 'complaints'
    ? filteredComplaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <a
          key={1}
          href="#"
          onClick={(e) => { e.preventDefault(); handlePageClick(1); }}
          className="relative inline-flex items-center px-2 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          1
        </a>
      );
      if (startPage > 2) {
        items.push(
          <span key="ellipsis-start" className="relative inline-flex items-center px-2 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <a
          key={i}
          href="#"
          onClick={(e) => { e.preventDefault(); handlePageClick(i); }}
          className={`relative inline-flex items-center px-2 sm:px-4 py-2 border border-gray-300 ${i === currentPage ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-700'} text-xs sm:text-sm font-medium hover:bg-gray-50`}
        >
          {i}
        </a>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <span key="ellipsis-end" className="relative inline-flex items-center px-2 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700">
            ...
          </span>
        );
      }
      items.push(
        <a
          key={totalPages}
          href="#"
          onClick={(e) => { e.preventDefault(); handlePageClick(totalPages); }}
          className="relative inline-flex items-center px-2 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </a>
      );
    }

    return items;
  };

  // Mobile Card Component for Complaints
  const ComplaintCard = ({ complaint }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900 text-sm truncate flex-1 mr-2">{complaint.title}</h3>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)} flex-shrink-0`}>
          {getStatusIcon(complaint.status)}
          {complaint.status === 'pending' ? 'Menunggu' : 
           complaint.status === 'in_progress' ? 'Proses' : 
           complaint.status === 'resolved' ? 'Selesai' : complaint.status}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <span className="font-medium">Pengadu:</span> {complaint.profiles?.name || 'Tidak diketahui'}
      </div>
      
      <div className="text-sm text-gray-500">
        {expandedDescriptions[complaint.id]
          ? complaint.description
          : complaint.description.slice(0, 80) + (complaint.description.length > 80 ? '...' : '')}
        {complaint.description.length > 80 && (
          <button
            onClick={() => toggleDescription(complaint.id)}
            className="ml-1 text-blue-600 hover:underline text-sm"
          >
            {expandedDescriptions[complaint.id] ? 'Sembunyikan' : 'Selengkapnya'}
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{new Date(complaint.created_at).toLocaleDateString('id-ID')}</span>
        {complaint.image_url && (
          <button
            onClick={() => setSelectedImage(complaint.image_url)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            Gambar
          </button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          onChange={(e) => handleStatusChange(complaint.id, e)}
          className="flex-1 text-xs border border-gray-300 rounded-md py-1.5 pl-2 pr-8 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          value=""
        >
          <option value="" disabled>Aksi</option>
          <option value="in_progress">Tandai Dalam Proses</option>
          <option value="resolved">Tandai Selesai</option>
          <option value="add_progress">Tambah Progres</option>
        </select>
        <button
          onClick={() => setSelectedComplaint(complaint)}
          className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
        >
          Detail
        </button>
      </div>
    </div>
  );

  // Mobile Card Component for Users
  const UserCard = ({ user }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
      <div className="flex items-center space-x-3">
        {user.profile_photo_url ? (
          <img
            src={user.profile_photo_url}
            alt="Profil"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.phone || 'Tidak tersedia'}</p>
        </div>
        {user.profile_photo_url && (
          <button
            onClick={() => setSelectedImage(user.profile_photo_url)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Lihat Foto
          </button>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'complaints') {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { title: 'Total Pengaduan', value: stats.total, icon: MessageSquare, color: 'text-blue-500' },
              { title: 'Menunggu', value: stats.pending, icon: Clock, color: 'text-yellow-500' },
              { title: 'Dalam Proses', value: stats.inProgress, icon: TrendingUp, color: 'text-blue-500' },
              { title: 'Selesai', value: stats.resolved, icon: CheckCircle, color: 'text-green-600' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 sm:w-10 sm:h-10 ${stat.color}`} />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-3 py-3 border-b sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Semua Pengaduan</h2>
                <input
                  type="text"
                  placeholder="Cari pengaduan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-64 bg-gray-50 text-gray-800 rounded-md p-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
                </svg>
                <span className="ml-3 text-gray-600">Memuat pengaduan...</span>
              </div>
            ) : paginatedItems.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Tidak ada pengaduan yang sesuai dengan pencarian.' : 'Tidak ada pengaduan tersedia.'}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile View - Cards */}
                <div className="block sm:hidden">
                  <div className="p-4 space-y-4">
                    {paginatedItems.map((complaint) => (
                      <ComplaintCard key={complaint.id} complaint={complaint} />
                    ))}
                  </div>
                </div>

                {/* Desktop View - Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Judul', 'Pengadu', 'Deskripsi', 'Status', 'Gambar', 'Dibuat', 'Aksi', 'Pembaruan'].map((header) => (
                          <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedItems.map((complaint) => (
                        <tr key={complaint.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {complaint.title}
                            </div>
                          </td>
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm text-gray-900">
                              {complaint.profiles?.name || 'Tidak diketahui'}
                            </div>
                          </td>
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm text-gray-500">
                              {expandedDescriptions[complaint.id]
                                ? complaint.description
                                : complaint.description.slice(0, 100) + (complaint.description.length > 100 ? '...' : '')}
                              {complaint.description.length > 100 && (
                                <button
                                  onClick={() => toggleDescription(complaint.id)}
                                  className="ml-1 text-blue-600 hover:underline text-sm"
                                >
                                  {expandedDescriptions[complaint.id] ? 'Tampilkan lebih sedikit' : 'Selengkapnya'}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                              {getStatusIcon(complaint.status)}
                              {complaint.status === 'pending' ? 'Menunggu' : 
                               complaint.status === 'in_progress' ? 'Dalam Proses' : 
                               complaint.status === 'resolved' ? 'Selesai' : complaint.status}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            {complaint.image_url ? (
                              <button
                                onClick={() => setSelectedImage(complaint.image_url)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                              >
                                Lihat
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                            {new Date(complaint.created_at).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-1 py-0.5 sm:px-2">
                            <select
                              onChange={(e) => handleStatusChange(complaint.id, e)}
                              className="block w-32 border border-gray-300 rounded-md py-1 pl-2 pr-7 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                              value=""
                            >
                              <option value="" disabled>Aksi</option>
                              <option value="in_progress">Tandai sebagai Dalam Proses</option>
                              <option value="resolved">Tandai sebagai Selesai</option>
                              <option value="add_progress">Tambah Pembaruan Progres</option>
                            </select>
                          </td>
                          <td className="px-1 py-0.5 text-sm sm:px-2">
                            <button
                              onClick={() => setSelectedComplaint(complaint)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-3 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                    <div className="order-2 sm:order-1">
                      <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{startIndex}</span> sampai <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{filteredComplaints.length}</span> hasil
                      </p>
                    </div>
                    <div className="order-1 sm:order-2">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginasi">
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePrevPage(); }}
                          className={`relative inline-flex items-center px-1 sm:px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                          disabled={currentPage === 1}
                        >
                          <span className="sr-only">Sebelumnya</span>
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        {renderPaginationItems()}
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handleNextPage(); }}
                          className={`relative inline-flex items-center px-1 sm:px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed' : ''}`}
                          disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <span className="sr-only">Selanjutnya</span>
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <Modal
              isOpen={!!selectedComplaint}
              onClose={() => {
                setSelectedComplaint(null);
                setExpandedUpdates({});
              }}
              title="Detail Pengaduan"
              size="xl"
            >
              {selectedComplaint && (
                <div className="space-y-6">
                  {selectedComplaint.progress_updates?.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          Pembaruan Progres ({selectedComplaint.progress_updates.length})
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {selectedComplaint.progress_updates.map((update) => (
                          <div key={update.id} className="relative pl-6 pb-4 border-l-2 border-blue-200">
                            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start flex-col sm:flex-row gap-2 sm:gap-0">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-800">Pembaruan</h4>
                                  <p className={`text-sm text-gray-700 mt-1 ${expandedUpdates[update.id] ? 'whitespace-pre-line' : 'line-clamp-3'}`}>
                                    {update.description}
                                  </p>
                                  {update.description.length > 150 && (
                                    <button
                                      onClick={() => toggleUpdateExpansion(update.id)}
                                      className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                    >
                                      {expandedUpdates[update.id] ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
                                    </button>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(update.created_at).toLocaleString('id-ID')}
                                </span>
                              </div>
                              {update.image_url && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs text-gray-500">Lampiran</span>
                                  </div>
                                  <img
                                    src={update.image_url}
                                    alt="Pembaruan progres"
                                    className="w-full max-w-xs h-auto rounded-md border cursor-pointer"
                                    onClick={() => setSelectedImage(update.image_url)}
                                  />
                                  <button
                                    onClick={() => setSelectedImage(update.image_url)}
                                    className="mt-1 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                                  >
                                    Lihat Gambar Penuh
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          </div>
        </div>
      );
    } else if (activeTab === 'users') {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-3 py-3 border-b sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Daftar Pengguna</h2>
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-64 bg-gray-50 text-gray-800 rounded-md p-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
                </svg>
                <span className="ml-3 text-gray-600">Memuat pengguna...</span>
              </div>
            ) : paginatedItems.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Tidak ada pengguna yang sesuai dengan pencarian.' : 'Tidak ada pengguna tersedia.'}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile View - Cards */}
                <div className="block sm:hidden">
                  <div className="p-4 space-y-4">
                    {paginatedItems.map((user) => (
                      <UserCard key={user.user_id} user={user} />
                    ))}
                  </div>
                </div>

                {/* Desktop View - Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Nama', 'Nomor Telepon', 'Foto Profil'].map((header) => (
                          <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedItems.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm text-gray-900">
                              {user.phone || 'Tidak tersedia'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            {user.profile_photo_url ? (
                              <button
                                onClick={() => setSelectedImage(user.profile_photo_url)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                              >
                                Lihat
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">Tidak ada foto</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-3 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                    <div className="order-2 sm:order-1">
                      <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{startIndex}</span> sampai <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{filteredUsers.length}</span> hasil
                      </p>
                    </div>
                    <div className="order-1 sm:order-2">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginasi">
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePrevPage(); }}
                          className={`relative inline-flex items-center px-1 sm:px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                          disabled={currentPage === 1}
                        >
                          <span className="sr-only">Sebelumnya</span>
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        {renderPaginationItems()}
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handleNextPage(); }}
                          className={`relative inline-flex items-center px-1 sm:px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed' : ''}`}
                          disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <span className="sr-only">Selanjutnya</span>
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return <div className="text-center py-12 text-gray-500">Pilih item menu</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={true}
        userName={user.user_metadata.name}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col w-full lg:ml-0">
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="px-3 py-3 sm:px-6 flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <p className="text-sm text-gray-600">Selamat datang, {user.user_metadata.name}</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}
              className="flex items-center gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-6">
          {error && (
            <div className="mb-4 p-3 rounded-md text-white text-sm bg-red-500">
              {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Gambar"
        size="lg"
      >
        {selectedImage && (
          <img src={selectedImage} alt="Gambar" className="w-full h-auto rounded-md" />
        )}
      </Modal>
      <Modal
        isOpen={!!showProgressForm}
        onClose={() => setShowProgressForm(null)}
        title="Tambah Pembaruan Progres"
        size="md"
      >
        {showProgressForm && (
          <ProgressUpdateForm
            complaintId={showProgressForm}
            user={user}
            onUpdateSubmitted={fetchComplaints}
            onCancel={() => setShowProgressForm(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default AdminDashboard;