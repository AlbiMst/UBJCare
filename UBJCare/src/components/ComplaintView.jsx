import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Eye, ArrowLeft } from 'lucide-react';
import supabase from '../supabaseClient';
import Modal from './Modal';

function ComplaintView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedUpdates, setExpandedUpdates] = useState({});

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('complaints')
        .select('*, progress_updates(id, description, image_url, created_at)')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Pengaduan tidak ditemukan atau terjadi kesalahan.');
      }
      if (!data) {
        throw new Error('Pengaduan tidak ditemukan.');
      }
      setComplaint(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat pengaduan.');
      console.error('Kesalahan:', err);
    } finally {
      setLoading(false);
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

  const toggleUpdateExpansion = (updateId) => {
    setExpandedUpdates((prev) => ({
      ...prev,
      [updateId]: !prev[updateId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Memuat pengaduan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </button>
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Detail Pengaduan</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Judul Pengaduan</h3>
              <p className="mt-1 text-gray-900 font-semibold">{complaint.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Deskripsi</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{complaint.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Status</h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(complaint.status)}`}>
                {getStatusIcon(complaint.status)}
                {complaint.status === 'pending' ? 'Menunggu' :
                 complaint.status === 'in_progress' ? 'Dalam Proses' :
                 complaint.status === 'resolved' ? 'Selesai' : complaint.status}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Tanggal Pengaduan</h3>
              <p className="mt-1 text-gray-700">{new Date(complaint.created_at).toLocaleString('id-ID')}</p>
            </div>
            {complaint.image_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Lampiran Gambar
                </h3>
                <div className="mt-2">
                  <img
                    src={complaint.image_url}
                    alt="Lampiran Pengaduan"
                    className="w-full max-w-xs h-auto rounded-md border cursor-pointer"
                    onClick={() => setSelectedImage(complaint.image_url)}
                  />
                  <button
                    onClick={() => setSelectedImage(complaint.image_url)}
                    className="mt-1 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    Lihat Gambar Penuh
                  </button>
                </div>
              </div>
            )}
            {complaint.progress_updates?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Pembaruan Progres ({complaint.progress_updates.length})</h3>
                </div>
                <div className="space-y-4">
                  {complaint.progress_updates.map((update) => (
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
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
        </div>
      </div>
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

export default ComplaintView;