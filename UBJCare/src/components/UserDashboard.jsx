import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageSquare, Plus, LogOut, Camera, Phone, Mail, Clock, CheckCircle, AlertCircle, Eye, Share2 } from 'lucide-react';
import supabase from '../supabaseClient';
import Sidebar from './Sidebar';
import Modal from './Modal';
import ProfileModal from './ProfileModal';

function ComplaintForm({ user, onComplaintSubmitted }) {
  const [title, setTitle] = useState('');
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

    if (!title || !description) {
      setError('Judul dan deskripsi diperlukan.');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const filePath = `public/${user.id}/complaint_${Date.now()}.jpg`;
        const { data, error: uploadError } = await supabase.storage
          .from('dbimg')
          .upload(filePath, image, { contentType: 'image/jpeg' });
        if (uploadError) throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
        imageUrl = supabase.storage.from('dbimg').getPublicUrl(filePath).data.publicUrl;
      }

      const { error: insertError } = await supabase.from('complaints').insert({
        user_id: user.id,
        title,
        description,
        image_url: imageUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setTitle('');
      setDescription('');
      setImage(null);
      onComplaintSubmitted();
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengaduan.');
      console.error('Kesalahan Pengiriman:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Kirim Pengaduan Baru</h2>
      </div>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Judul Pengaduan</label>
          <input
            type="text"
            placeholder="Masukkan judul pengaduan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 text-gray-800 rounded-md p-3 text-sm border focus:outline-none focus:ring-2 focus:ring-green-600"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
          <textarea
            placeholder="Jelaskan pengaduan Anda secara rinci"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50 text-gray-800 rounded-md p-3 text-sm border focus:outline-none focus:ring-2 focus:ring-green-600"
            disabled={loading}
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-2" />
            Lampirkan Gambar (hanya JPG, maks 5MB)
          </label>
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-green-50 file:text-green-600 hover:file:bg-green-100"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full bg-green-600 text-white rounded-md p-3 text-sm font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Mengirim Pengaduan...' : 'Kirim Pengaduan'}
        </button>
      </div>
    </div>
  );
}

function UserDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [expandedUpdates, setExpandedUpdates] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copySuccess, setCopySuccess] = useState('');
  const complaintsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_photo_url')
        .eq('user_id', user.id)
        .single();
      if (!error) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Gagal mengambil profil pengguna:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, progress_updates(id, description, image_url, created_at)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Kesalahan Mengambil Pengaduan:', error);
        setComplaints([]);
      } else {
        setComplaints(data || []);
        const total = data?.length || 0;
        const pending = data?.filter(c => c.status === 'pending').length || 0;
        const inProgress = data?.filter(c => c.status === 'in_progress').length || 0;
        const resolved = data?.filter(c => c.status === 'resolved').length || 0;
        setStats({ total, pending, inProgress, resolved });
      }
    } catch (err) {
      console.error('Kesalahan Pengambilan Tidak Terduga:', err);
      setComplaints([]);
    }
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

  const handleShare = async (complaintId) => {
    const shareUrl = `${window.location.origin}/complaint/${complaintId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(complaintId);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Gagal menyalin URL:', err);
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const startIndex = (currentPage - 1) * complaintsPerPage + 1;
  const endIndex = Math.min(currentPage * complaintsPerPage, filteredComplaints.length);

  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * complaintsPerPage,
    currentPage * complaintsPerPage
  );

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
    const maxVisiblePages = 5;
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
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          1
        </a>
      );
      if (startPage > 2) {
        items.push(
          <span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
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
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${i === currentPage ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-700'} text-sm font-medium hover:bg-gray-50`}
        >
          {i}
        </a>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            ...
          </span>
        );
      }
      items.push(
        <a
          key={totalPages}
          href="#"
          onClick={(e) => { e.preventDefault(); handlePageClick(totalPages); }}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </a>
      );
    }

    return items;
  };

  const renderContent = () => {
    if (activeTab === 'complaints') {
      const toggleUpdateExpansion = (id) => {
        setExpandedUpdates(prev => ({
          ...prev,
          [id]: !prev[id]
        }));
      };

      const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Pengaduan Saya', value: stats.total, icon: MessageSquare, color: 'text-blue-500' },
              { title: 'Menunggu', value: stats.pending, icon: Clock, color: 'text-yellow-500' },
              { title: 'Dalam Proses', value: stats.inProgress, icon: AlertCircle, color: 'text-blue-500' },
              { title: 'Selesai', value: stats.resolved, icon: CheckCircle, color: 'text-green-600' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 border flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-4 py-3 border-b sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Pengaduan Saya</h2>
                </div>
                <input
                  type="text"
                  placeholder="Cari pengaduan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-64 bg-gray-50 text-gray-800 rounded-md p-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              {paginatedComplaints.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchQuery ? 'Tidak ada pengaduan yang sesuai dengan pencarian.' : 'Belum ada pengaduan yang dikirim.'}
                  </p>
                  {!searchQuery && (
                    <p className="text-sm text-gray-400">Kirim pengaduan pertama Anda menggunakan formulir.</p>
                  )}
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Judul', 'Deskripsi', 'Status', 'Gambar', 'Dikirim', 'Aksi'].map((header) => (
                          <th 
                            key={header} 
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedComplaints.map((complaint) => (
                        <tr key={complaint.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {complaint.title}
                            </div>
                          </td>
                          <td className="px-4 py-4 sm:px-6 max-w-xs">
                            <div className="text-sm text-gray-500">
                              {expandedDescriptions[complaint.id]
                                ? complaint.description
                                : complaint.description.slice(0, 30) + (complaint.description.length > 100 ? '...' : '')}
                              {complaint.description.length > 100 && (
                                <button
                                  onClick={() => toggleDescription(complaint.id)}
                                  className="ml-1 text-blue-600 hover:underline text-sm"
                                >
                                  {expandedDescriptions[complaint.id] ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
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
                                <Eye className="w-4 h-4" />
                                Lihat
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                            {new Date(complaint.created_at).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Lihat Detail
                              </button>
                              <button
                                onClick={() => handleShare(complaint.id)}
                                className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-medium"
                              >
                                {copySuccess === complaint.id ? 'Tersalin!' : 'Bagikan'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-700">
                          Menampilkan <span className="font-medium">{startIndex}</span> sampai <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{filteredComplaints.length}</span> hasil
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginasi">
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePrevPage(); }}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                            disabled={currentPage === 1}
                          >
                            <span className="sr-only">Sebelumnya</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </a>
                          {renderPaginationItems()}
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNextPage(); }}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed' : ''}`}
                            disabled={currentPage === totalPages || totalPages === 0}
                          >
                            <span className="sr-only">Selanjutnya</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                              <div className="flex justify-between items-start">
                                <div>
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
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
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
                                    <Eye className="w-3 h-3" />
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
    }

    if (activeTab === 'new-complaint') {
      return <ComplaintForm user={user} onComplaintSubmitted={fetchComplaints} />;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="text-center py-12 text-gray-500">Pilih item menu untuk melihat konten</div>
      </div>
    );
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat flex flex-col lg:flex-row">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={false}
        userName={user.user_metadata.name}
        userPhoto={userProfile?.profile_photo_url}
        onProfileClick={handleProfileClick}
      />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-3 sm:px-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Selamat datang, {user.user_metadata.name}</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
      <Modal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          fetchUserProfile();
        }}
        title="Ubah Profil"
        size="md"
      >
        <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
      </Modal>
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Gambar Pengaduan"
        size="lg"
      >
        {selectedImage && (
          <img src={selectedImage} alt="Pengaduan" className="w-full h-auto rounded-md" />
        )}
      </Modal>
    </div>
  );
}

export default UserDashboard;