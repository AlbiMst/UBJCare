import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kcqttjvtmehtuxiaxsrn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcXR0anZ0bWVodHV4aWF4c3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODk0MDQsImV4cCI6MjA2ODk2NTQwNH0.jR0JHEAfALjKAmWLLcyZRznLbCeCwj1_5aiV7Sf9gtE'
);

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email wajib diisi";
    if (!formData.password) newErrors.password = "Kata sandi wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Harap isi semua kolom wajib dengan benar");
      return;
    }
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("email not confirmed")) {
          throw new Error("Harap verifikasi email Anda sebelum masuk");
        }
        throw new Error("Email atau kata sandi salah");
      }

      setUser(data.user);
      showToast("Berhasil masuk!", "success");

      setTimeout(() => {
        navigate(data.user.user_metadata.role === "admin" ? "/admin-dashboard" : "/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error saat masuk:", error.message);
      showToast(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 font-montserrat">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white text-sm animate-slide-in max-w-sm z-50
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-xl shadow-[10px_10px_0px_0px_#2d3748] flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 relative hidden md:block">
          <a href="#" className="absolute top-4 left-4 text-slate-50 text-2xl font-bold z-10">UBJ-CARE</a>
          <a href="/" className="absolute top-4 right-4 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200 z-10">
            Kembali ke Beranda →
          </a>
          <div className="relative h-full">
            <img
              src="https://i.ibb.co/Z604TcdM/Whats-App-Image-2025-07-25-at-01-30-33.jpg"
              alt=" "
              className="w-full h-full object-cover opacity-100"
              onError={(e) => { e.target.style.display = 'none'; console.log("Gambar gagal dimuat"); }}
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
            <h1 className="text-gray-900 text-xl sm:text-2xl font-extrabold mb-2">Masuk</h1>
            <p className="text-gray-600 mb-6 text-sm font-medium">
              Belum punya akun?{" "}
              <a href="/register" className="text-green-500 hover:underline font-medium">Buat akun</a>
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-gray-700 text-xs mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email Anda"
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${errors.email ? "border border-red-500" : ""}`}
                  required
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1 block">Kata Sandi</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi Anda"
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${errors.password ? "border border-red-500" : ""}`}
                  required
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-green-500 text-white rounded-md p-3 text-sm hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200 flex items-center justify-center font-normal font-medium"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
                  </svg>
                ) : null}
                {isLoading ? "Sedang Masuk..." : "Masuk"}
              </button>
            </div>
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