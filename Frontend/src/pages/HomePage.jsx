import React from 'react';
import { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Star,
  Shield,
  Zap,
  Heart,
  TrendingUp,
  Award,
  Timer,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-montserrat">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">UBJ-CARE</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#beranda" className="text-gray-700 hover:text-green-500 transition-colors">Beranda</a>
              <a href="#fitur" className="text-gray-700 hover:text-green-500 transition-colors">Fitur</a>
              <a href="#cara-kerja" className="text-gray-700 hover:text-green-500 transition-colors">Cara Kerja</a>
              <a href="#kontak" className="text-gray-700 hover:text-green-500 transition-colors">Kontak</a>
              <a href="/login" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Masuk
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-500 transition-colors p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#beranda"
                  className="block px-3 py-2 text-gray-700 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beranda
                </a>
                <a
                  href="#fitur"
                  className="block px-3 py-2 text-gray-700 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fitur
                </a>
                <a
                  href="#cara-kerja"
                  className="block px-3 py-2 text-gray-700 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cara Kerja
                </a>
                <a
                  href="#kontak"
                  className="block px-3 py-2 text-gray-700 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontak
                </a>
                <a
                href="/login"
                className="w-full text-left bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative py-20 bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sistem Pengaduan
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Laporkan Masalah
                  <span className="text-green-500 block bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    Fasilitas Kampus
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Ajukan keluhan fasilitas kampus dengan cepat dan ikuti perkembangan laporan Anda secara real-time dengan sistem terpercaya kami.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Buat Pengaduan
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-green-500 text-green-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 hover:shadow-lg">
                  Pelajari Lebih Lanjut
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1,250+</div>
                  <div className="text-sm text-gray-500">Pengaduan Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-500">Tingkat Kepuasan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-500">Support</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <MessageSquare className="h-8 w-8" />
                      <div className="bg-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        Diproses
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">Pengaduan Baru</h3>
                    <p className="text-green-100 mb-4 leading-relaxed">
                      AC di ruang kuliah A.1.5 tidak berfungsi dengan baik. Suhu ruangan terlalu panas untuk kegiatan pembelajaran.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">2 jam lalu</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Tim Teknisi</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Steps */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="text-sm text-gray-600">Laporan diterima</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="text-sm text-gray-600">Sedang diproses</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <div className="text-sm text-gray-400">Menunggu penyelesaian</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-16 bg-white">
        <div className="container relative flex flex-col justify-between h-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="mb-1 text-3xl font-extrabold leading-tight text-gray-900">Mengapa Memilih UBJ-CARE?</h2>
          <p className="mb-12 text-lg text-gray-500">Solusi terbaik untuk melaporkan dan menyelesaikan masalah fasilitas kampus dengan cepat dan efisien.</p>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-indigo-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 border-2 border-indigo-300">
                  <Zap className="h-8 w-8 text-indigo-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Pelaporan Cepat</h3>
                  <p className="text-gray-600">Laporkan masalah fasilitas dalam hitungan menit dengan antarmuka yang mudah digunakan.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-purple-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(147, 51, 234, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Tracking Real-time</h3>
                  <p className="text-gray-600">Pantau status pengaduan Anda secara real-time dari mulai diterima hingga selesai.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-blue-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Keamanan Terjamin</h3>
                  <p className="text-gray-600">Data pengaduan Anda aman dengan sistem enkripsi dan perlindungan privasi terbaik.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-yellow-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245, 158, 11, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 border-2 border-yellow-300">
                  <Users className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Tim Responsif</h3>
                  <p className="text-gray-600">Tim teknisi berpengalaman siap menangani setiap pengaduan dengan profesional.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-green-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 border-2 border-green-300">
                  <Star className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Rating & Feedback</h3>
                  <p className="text-gray-600">Berikan penilaian dan feedback untuk membantu kami meningkatkan layanan.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-red-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 border-2 border-red-300">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-gray-800 text-xl font-semibold">Support 24/7</h3>
                  <p className="text-gray-600">Dukungan teknis tersedia 24 jam untuk memastikan pengalaman terbaik Anda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="mb-1 text-3xl font-extrabold leading-tight text-gray-900 text-left">Langkah Mudah Melapor</h2>
            <p className="mb-6 text-lg text-gray-500">Proses pengaduan fasilitas kampus dalam 6 langkah sederhana</p>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-green-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 border-2 border-green-300">
                  <span className="font-bold text-xl text-green-600">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Buat Laporan</h3>
                  <p className="text-gray-600">Isi form pengaduan dengan detail masalah fasilitas yang ditemukan.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-orange-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(249, 115, 22, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 border-2 border-orange-300">
                  <span className="font-bold text-xl text-orange-600">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Penanganan</h3>
                  <p className="text-gray-600">Teknisi akan menangani masalah sesuai dengan prioritas dan jadwal.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-purple-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(147, 51, 234, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300">
                  <span className="font-bold text-xl text-purple-600">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Selesai</h3>
                  <p className="text-gray-600">Masalah diselesaikan dan Anda akan menerima notifikasi konfirmasi.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-teal-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(20, 184, 166, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 border-2 border-teal-300">
                  <span className="font-bold text-xl text-teal-600">4</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Evaluasi</h3>
                  <p className="text-gray-600">Tim akan mengevaluasi hasil perbaikan untuk memastikan kualitas.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-indigo-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 border-2 border-indigo-300">
                  <span className="font-bold text-xl text-indigo-600">5</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Laporan Hasil</h3>
                  <p className="text-gray-600">Anda akan menerima laporan resmi mengenai proses dan solusi yang diterapkan.</p>
                </div>
              </div>
            </div>
            <div 
              className="group p-6 py-8 sm:p-8 rounded-xl bg-white border-2 border-pink-200 bg-opacity-80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
              style={{
                background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(236, 72, 153, 0.1), transparent 40%)'
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div 
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                    left: 'var(--mouse-x, 50%)',
                    top: 'var(--mouse-y, 50%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              <div className="space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 border-2 border-pink-300">
                  <span className="font-bold text-xl text-pink-600">6</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Peningkatan</h3>
                  <p className="text-gray-600">Kami akan menggunakan umpan balik Anda untuk meningkatkan layanan di masa depan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="text-gray-700 body-font relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex sm:flex-nowrap flex-wrap">
            <div className="lg:w-2/3 md:w-1/2 bg-gray-200 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
              <iframe 
                width="100%" 
                height="100%" 
                className="absolute inset-0" 
                frameBorder="0" 
                title="map" 
                marginHeight="0"
                marginWidth="0" 
                scrolling="no"
                src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Universitas%20Indonesia%20Depok&ie=UTF8&t=&z=14&iwloc=B&output=embed"
                style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
              ></iframe>
              <div className="bg-white relative flex flex-wrap py-8 px-6 rounded-xl shadow-xl border border-green-100 bg-opacity-95 transition-all duration-300 hover:shadow-2xl">
                <div className="w-full lg:w-1/2 px-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 bg-opacity-10">
                      <MapPin className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Alamat</h2>
                      <p className="mt-2 text-gray-600 text-base font-medium">Bekasi, Jawa Barat, Indonesia</p>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 px-4 mt-6 lg:mt-0">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 bg-opacity-10">
                      <Mail className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Email</h2>
                      <a className="mt-2 text-green-500 text-base font-medium hover:text-green-600 transition-colors" href="mailto:support@ubjcare.ac.id">support@ubjcare.ac.id</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 bg-opacity-10">
                      <Phone className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Telepon</h2>
                      <p className="mt-2 text-gray-600 text-base font-medium">+62 21 7863 5555</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
              <p className="leading-relaxed mb-5 text-gray-600">Tim support kami siap membantu Anda dengan pertanyaan atau masukan</p>
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Nama</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="Nama Anda"
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="Email Anda"
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Pesan</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  placeholder="Tulis pesan Anda di sini"
                ></textarea>
              </div>
              <button className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg transition-colors duration-200">
                Kirim
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.01)_25%,rgba(255,255,255,0.01)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.01)_75%)] bg-[length:20px_20px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">UBJ-CARE</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Sistem pengaduan fasilitas kampus terdepan untuk menciptakan lingkungan belajar yang nyaman.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 cursor-pointer group">
                  <div className="w-5 h-5 bg-green-500 rounded group-hover:scale-110 transition-transform"></div>
                </div>
                <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 cursor-pointer group">
                  <div className="w-5 h-5 bg-green-500 rounded group-hover:scale-110 transition-transform"></div>
                </div>
                <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 cursor-pointer group">
                  <div className="w-5 h-5 bg-green-500 rounded group-hover:scale-110 transition-transform"></div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold text-white mb-6 relative">
                Menu
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-green-500"></div>
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#beranda" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#fitur" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#cara-kerja" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <a href="#kontak" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold text-white mb-6 relative">
                Layanan
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-green-500"></div>
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Pengaduan Online
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Tracking Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-all duration-300 flex items-center group">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                    Bantuan
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-1">
              <h4 className="text-lg font-bold text-white mb-6 relative">
                Kontak
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-green-500"></div>
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <span>+62 21 7863 5555</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-400" />
                  </div>
                  <span>support@ubjcare.ac.id</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-400" />
                  </div>
                  <span>Bekasi, Jawa Barat</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 UBJ-CARE. Semua hak dilindungi undang-undang.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;