import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kcqttjvtmehtuxiaxsrn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcXR0anZ0bWVodHV4aWF4c3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODk0MDQsImV4cCI6MjA2ODk2NTQwNH0.jR0JHEAfALjKAmWLLcyZRznLbCeCwj1_5aiV7Sf9gtE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ResetPassword() {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "", accessToken: "", refreshToken: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse both query and hash parameters
    const query = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace("#", ""));
    const accessToken = query.get("access_token") || hashParams.get("access_token");
    const refreshToken = query.get("refresh_token") || hashParams.get("refresh_token");
    const expiresAt = query.get("expires_at") || hashParams.get("expires_at");

    // Log for debugging
    console.log("URL Parsing:", {
      location: location.href,
      query: Object.fromEntries(query),
      hash: Object.fromEntries(hashParams),
      accessToken,
      refreshToken,
      expiresAt,
    });

    // Check if access_token is present
    if (!accessToken) {
      console.error("No access_token found in URL");
      showToast("Tautan reset tidak valid. Silakan coba lagi.", "error");
      setTimeout(() => navigate("/forgot-password"), 1500);
      return;
    }

    // Check if token is expired
    if (expiresAt && Number(expiresAt) < Math.floor(Date.now() / 1000)) {
      console.error("Access token expired", { expiresAt });
      showToast("Tautan reset telah kedaluwarsa. Silakan minta tautan baru.", "error");
      setTimeout(() => navigate("/forgot-password"), 1500);
      return;
    }

    // Store tokens in formData
    setFormData((prev) => ({ ...prev, accessToken, refreshToken }));
  }, [navigate, location]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Kata sandi wajib diisi";
    else if (formData.password.length < 6) newErrors.password = "Kata sandi minimal 6 karakter";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Kata sandi tidak cocok";
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
      showToast("Harap isi semua kolom dengan benar");
      return;
    }
    setIsLoading(true);

    try {
      // Set Supabase session with access_token and refresh_token
      console.log("Setting Supabase session with:", {
        access_token: formData.accessToken,
        refresh_token: formData.refreshToken,
      });
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: formData.accessToken,
        refresh_token: formData.refreshToken || undefined,
      });

      if (sessionError) {
        console.error("Session error:", sessionError.message);
        throw new Error("Gagal mengatur sesi: " + sessionError.message);
      }

      // Update password in Supabase
      console.log("Updating password in Supabase");
      const { error: updateError } = await supabase.auth.updateUser({ password: formData.password });

      if (updateError) {
        console.error("Update error:", updateError.message);
        throw new Error(updateError.message);
      }

      // Update password in Laravel database
      console.log("Sending password update to Laravel API");
      const response = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${formData.accessToken}`,
        },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Laravel API error:", data);
        throw new Error(data.error || "Gagal memperbarui kata sandi");
      }

      showToast("Kata sandi berhasil diperbarui!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error saat reset kata sandi:", error.message);
      showToast(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 font-montserrat">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white text-sm animate-slide-in max-w-sm z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-xl shadow-[10px_10px_0px_0px_#2d3748] flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 relative hidden md:block">
          <a href="#" className="absolute top-4 left-4 text-slate-50 text-2xl font-bold z-10">
            UBJ-CARE
          </a>
          <a
            href="/"
            className="absolute top-4 right-4 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200 z-10"
          >
            Kembali ke Beranda →
          </a>
          <div className="relative h-full">
            <img
              src="https://i.ibb.co/Z604TcdM/Whats-App-Image-2025-07-25-at-01-30-33.jpg"
              alt="Desert landscape"
              className="w-full h-full object-cover opacity-100"
              onError={(e) => {
                e.target.style.display = "none";
                console.log("Gambar gagal dimuat");
              }}
            />
            <div className="absolute inset-0 bg-gray-800/50"></div>
            <div className="absolute bottom-8 left-8 text-slate-50">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Laporkan Hari Ini</h2>
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
            <h1 className="text-gray-900 text-xl sm:text-2xl font-extrabold mb-2">Reset Kata Sandi</h1>
            <p className="text-gray-600 mb-6 text-sm font-medium">Masukkan kata sandi baru Anda.</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-700 text-xs mb-1 block">Kata Sandi Baru</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi baru"
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${
                    errors.password ? "border border-red-500" : ""
                  }`}
                  required
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1 block">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi kata sandi baru"
                  className={`w-full bg-gray-100 text-gray-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ${
                    errors.confirmPassword ? "border border-red-500" : ""
                  }`}
                  required
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white rounded-md p-3 text-sm hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200 flex items-center justify-center font-normal font-medium"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
                  </svg>
                ) : null}
                {isLoading ? "Memperbarui..." : "Perbarui Kata Sandi"}
              </button>
            </form>

            <p className="text-gray-600 mt-4 text-sm font-medium">
              Kembali ke <a href="/login" className="text-green-500 hover:underline font-medium">Sign In</a>
            </p>
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