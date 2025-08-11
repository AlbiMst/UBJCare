![TerapyApp Banner](https://placehold.co/1200x400/08CB00/FFFFFF?text=UBJ%20Care)

## Demo Video

<video src="assets/demo.mp4" controls width="700">
  Browser Anda tidak mendukung pemutaran video.
</video>
> _Klik gambar di atas untuk menonton demo aplikasi UBJ Care._

## Akun Uji Coba

**USER**  
- Email: `xecibap514@cotasen.com`  
- Password: `user123`

**ADMIN**  
- Email: `admin.ubjcare@ac.id`  
- Password: `admin123`

# UBJ Care – Sistem Pengaduan Fasilitas Kampus

## Latar Belakang Permasalahan

Fasilitas kampus merupakan elemen penting dalam mendukung proses pembelajaran dan kenyamanan mahasiswa. Namun, berdasarkan keluhan yang disampaikan oleh mahasiswa Universitas Bhayangkara Jakarta Raya (Ubhara Jaya), sejumlah fasilitas di kampus, khususnya di Gedung R. Said Soekanto, masih belum memadai. Beberapa masalah yang sering dikeluhkan meliputi kursi yang kurang nyaman, AC yang tidak berfungsi dengan baik, dan lahan parkir yang terbatas. Kondisi ini menyebabkan ketidaknyamanan, seperti ruangan yang pengap dan mengganggu konsentrasi belajar, sehingga berdampak pada kualitas pengalaman akademik mahasiswa.

Kurangnya sistem pengaduan yang terstruktur dan efisien juga menjadi kendala bagi mahasiswa untuk menyampaikan keluhan mereka secara langsung dan mendapatkan tindak lanjut yang cepat dari pihak kampus. Oleh karena itu, diperlukan sebuah solusi berbasis teknologi yang dapat mempermudah proses pengaduan fasilitas, meningkatkan transparansi, dan memastikan perbaikan dilakukan secara tepat waktu.

## Solusi yang Ditawarkan

**UBJ Care** hadir sebagai sistem pengaduan fasilitas kampus berbasis website yang dirancang untuk mempermudah mahasiswa dalam melaporkan masalah fasilitas di Universitas Bhayangkara Jakarta Raya. Sistem ini bertujuan untuk menciptakan lingkungan belajar yang lebih nyaman dengan memungkinkan mahasiswa menyampaikan keluhan secara langsung melalui platform digital yang terintegrasi. UBJ Care tidak hanya memfasilitasi pelaporan, tetapi juga memungkinkan pihak kampus untuk memantau dan menindaklanjuti keluhan secara efisien.

## Fitur-Fitur Utama

- **Formulir Pengaduan Online:** Mahasiswa dapat mengisi formulir pengaduan dengan detail seperti jenis fasilitas, lokasi, dan deskripsi masalah, dilengkapi dengan opsi untuk mengunggah foto sebagai bukti.
- **Pelacakan Status Pengaduan:** Pengguna dapat memantau status pengaduan mereka secara real-time, mulai dari "pending", "dalam proses", hingga "selesai", untuk memastikan transparansi.
- **Antarmuka Ramah Pengguna:** Desain website yang intuitif dan responsif, memastikan kemudahan akses baik melalui perangkat komputer maupun ponsel.

## Teknologi yang Digunakan

### Frontend

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"/> **React.js**  
  Pustaka JavaScript untuk membangun antarmuka pengguna yang interaktif dan modular.
- <img src="https://vitejs.dev/logo.svg" width="24"/> **Vite**  
  Alat pengembangan dan bundling yang cepat untuk aplikasi React.
- <img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.6ea76c3b.svg" width="24"/> **Tailwind CSS**  
  Framework CSS utility-first untuk styling antarmuka yang konsisten dan responsif.
- <img src="https://lucide.dev/logo.svg" width="24"/> **Lucide React**  
  Pustaka ikon untuk menambah ikon visual pada aplikasi.

### Backend & Database

- <img src="https://supabase.com/icons/icon-512x512.png" width="24"/> **Supabase**  
  Backend-as-a-service: autentikasi, database PostgreSQL, REST API, dan storage.
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="24"/> **PostgreSQL**  
  Database relasional untuk menyimpan data pengaduan, profil, dan progres.

## Arsitektur Database

![Database ERD](https://i.ibb.co.com/0pz0Qzfq/image.png)

**Tabel utama dan field:**

- **profiles**
  - `user_id` (uuid, primary key): ID pengguna dari Supabase Auth.
  - `name` (text): Nama lengkap pengguna.
  - `phone` (text, nullable): Nomor telepon pengguna.
  - `profile_photo_url` (text, nullable): URL foto profil di Supabase Storage.
  - `updated_at` (timestamp): Waktu pembaruan profil.

- **complaints**
  - `id` (uuid, primary key): ID unik pengaduan.
  - `user_id` (uuid, foreign key): ID pengguna yang membuat pengaduan.
  - `title` (text): Judul pengaduan.
  - `description` (text): Deskripsi pengaduan.
  - `image_url` (text, nullable): URL gambar pengaduan di Supabase Storage.
  - `status` (text): Status pengaduan (pending, in_progress, resolved).
  - `created_at` (timestamp): Waktu pembuatan pengaduan.
  - `updated_at` (timestamp, nullable): Waktu pembaruan status.

- **progress_updates**
  - `id` (uuid, primary key): ID unik pembaruan progres.
  - `complaint_id` (uuid, foreign key): ID pengaduan terkait.
  - `description` (text): Deskripsi pembaruan progres.
  - `image_url` (text, nullable): URL gambar pembaruan di Supabase Storage.
  - `created_by` (uuid): ID pengguna (admin) yang membuat pembaruan.
  - `created_at` (timestamp): Waktu pembuatan pembaruan.

```sql
-- Struktur tabel utama
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone TEXT,
  profile_photo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES complaints(id),
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id)
);
```

## Cara Penginstalan

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd UBJCare
   ```

2. **Setup Supabase**
   - Daftar di [supabase.com](https://supabase.com)
   - Buat project baru, catat `Project URL` dan `Anon Key`
   - Buat bucket storage: `dbimg` (public)
     - Masuk menu Storage → Create bucket → Nama: `dbimg` → Public
   - Buat tabel di SQL Editor dengan skrip di atas
   - Atur policies (RLS) sesuai kebutuhan (lihat gambar di bawah)
   - Tambahkan environment variable di `.env`:
     ```
     VITE_SUPABASE_URL=...
     VITE_SUPABASE_ANON_KEY=...
     ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

5. **Akses di browser**
   ```
   http://localhost:5173
   ```

### Contoh Setting Policies Supabase

![Supabase Policy 1](https://i.ibb.co.com/kgYNhTHP/image.png)
![Supabase Policy 2](https://i.ibb.co.com/gZRtcNzc/image.png)
![Supabase Policy 3](https://i.ibb.co.com/mVdbNtSJ/image.png)

## Dokumentasi API

### 1. Autentikasi

#### 1.1. Pendaftaran Pengguna (Sign Up)

- **Endpoint:** `POST /auth/v1/signup`
- **Deskripsi:** Mendaftarkan pengguna baru dan menyimpan profil di tabel profiles.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "options": {
      "data": {
        "name": "string",
        "role": "string" // "user" atau "admin"
      }
    }
  }
  ```
- **Response:**
  - 200 OK:
    ```json
    {
      "user": {
        "id": "uuid",
        "email": "string",
        "user_metadata": {
          "name": "string",
          "role": "string"
        }
      },
      "session": {
        "access_token": "string",
        "refresh_token": "string"
      }
    }
    ```
  - 400 Bad Request:
    ```json
    { "error": "Email sudah terdaftar" }
    ```
- **Catatan:** Setelah pendaftaran, data profil (name, phone) disimpan ke tabel profiles.

#### 1.2. Login Pengguna (Sign In)

- **Endpoint:** `POST /auth/v1/signinWithPassword`
- **Deskripsi:** Mengautentikasi pengguna dan mengembalikan token sesi.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - 200 OK:
    ```json
    {
      "user": {
        "id": "uuid",
        "email": "string",
        "user_metadata": {
          "name": "string",
          "role": "string"
        }
      },
      "session": {
        "access_token": "string",
        "refresh_token": "string"
      }
    }
    ```
  - 400 Bad Request:
    ```json
    { "error": "Email atau kata sandi salah" }
    ```
- **Catatan:** Token access_token digunakan untuk autentikasi pada endpoint lain.

#### 1.3. Perbarui Profil Pengguna

- **Endpoint:** `POST /auth/v1/user`
- **Deskripsi:** Memperbarui metadata pengguna di Supabase Auth.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "data": {
      "name": "string",
      "phone": "string"
    }
  }
  ```
- **Response:**
  - 200 OK:
    ```json
    {
      "id": "uuid",
      "email": "string",
      "user_metadata": {
        "name": "string",
        "phone": "string",
        "role": "string"
      }
    }
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Token tidak valid" }
    ```

### 2. Pengelolaan Pengaduan

#### 2.1. Membuat Pengaduan Baru

- **Endpoint:** `POST /rest/v1/complaints`
- **Deskripsi:** Menyimpan pengaduan baru ke tabel complaints.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "user_id": "uuid",
    "title": "string",
    "description": "string",
    "image_url": "string", // nullable, URL dari Supabase Storage
    "status": "pending",
    "created_at": "timestamp"
  }
  ```
- **Response:**
  - 201 Created:
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "description": "string",
      "image_url": "string",
      "status": "pending",
      "created_at": "timestamp"
    }
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

#### 2.2. Mengambil Daftar Pengaduan (Pengguna)

- **Endpoint:** `GET /rest/v1/complaints?user_id=eq.<user_id>&select=*,progress_updates(id,description,image_url,created_at)`
- **Deskripsi:** Mengambil daftar pengaduan milik pengguna tertentu beserta pembaruan progres.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
- **Response:**
  - 200 OK:
    ```json
    [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "string",
        "description": "string",
        "image_url": "string",
        "status": "string",
        "created_at": "timestamp",
        "progress_updates": [
          {
            "id": "uuid",
            "description": "string",
            "image_url": "string",
            "created_at": "timestamp"
          }
        ]
      }
    ]
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

#### 2.3. Mengambil Daftar Pengaduan (Admin)

- **Endpoint:** `GET /rest/v1/complaints?select=*,progress_updates(id,description,image_url,created_at),profiles!user_id(name)`
- **Deskripsi:** Mengambil semua pengaduan beserta pembaruan progres dan nama pengadu untuk admin.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
- **Response:**
  - 200 OK:
    ```json
    [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "string",
        "description": "string",
        "image_url": "string",
        "status": "string",
        "created_at": "timestamp",
        "progress_updates": [
          {
            "id": "uuid",
            "description": "string",
            "image_url": "string",
            "created_at": "timestamp"
          }
        ],
        "profiles": {
          "name": "string"
        }
      }
    ]
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

#### 2.4. Memperbarui Status Pengaduan

- **Endpoint:** `PATCH /rest/v1/complaints?id=eq.<id>`
- **Deskripsi:** Memperbarui status pengaduan (khusus admin).
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "status": "string", // "in_progress" atau "resolved"
    "updated_at": "timestamp"
  }
  ```
- **Response:**
  - 200 OK:
    ```json
    {
      "id": "uuid",
      "status": "string",
      "updated_at": "timestamp"
    }
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

### 3. Pembaruan Progres

#### 3.1. Menambahkan Pembaruan Progres

- **Endpoint:** `POST /rest/v1/progress_updates`
- **Deskripsi:** Menyimpan pembaruan progres untuk pengaduan tertentu (khusus admin).
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "complaint_id": "uuid",
    "description": "string",
    "image_url": "string", // nullable
    "created_by": "uuid",
    "created_at": "timestamp"
  }
  ```
- **Response:**
  - 201 Created:
    ```json
    {
      "id": "uuid",
      "complaint_id": "uuid",
      "description": "string",
      "image_url": "string",
      "created_by": "uuid",
      "created_at": "timestamp"
    }
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

### 4. Pengelolaan Profil

#### 4.1. Mengambil Profil Pengguna

- **Endpoint:** `GET /rest/v1/profiles?user_id=eq.<user_id>&select=*`
- **Deskripsi:** Mengambil data profil pengguna.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
- **Response:**
  - 200 OK:
    ```json
    {
      "user_id": "uuid",
      "name": "string",
      "phone": "string",
      "profile_photo_url": "string",
      "updated_at": "timestamp"
    }
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

#### 4.2. Memperbarui Profil Pengguna

- **Endpoint:** `POST /rest/v1/profiles`
- **Deskripsi:** Memperbarui atau menyisipkan data profil pengguna (upsert).
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "user_id": "uuid",
    "name": "string",
    "phone": "string",
    "profile_photo_url": "string",
    "updated_at": "timestamp"
  }
  ```
- **Response:**
  - 200 OK:
    ```json
    {
      "user_id": "uuid",
      "name": "string",
      "phone": "string",
      "profile_photo_url": "string",
      "updated_at": "timestamp"
    }
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

#### 4.3. Mengambil Daftar Pengguna (Admin)

- **Endpoint:** `GET /rest/v1/profiles?select=user_id,name,phone,profile_photo_url`
- **Deskripsi:** Mengambil daftar semua pengguna untuk admin.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
- **Response:**
  - 200 OK:
    ```json
    [
      {
        "user_id": "uuid",
        "name": "string",
        "phone": "string",
        "profile_photo_url": "string"
      }
    ]
    ```
  - 401 Unauthorized:
    ```json
    { "error": "Akses ditolak" }
    ```

### 5. Penyimpanan File

#### 5.1. Mengunggah Gambar

- **Endpoint:** `POST /storage/v1/object/dbimg/<path>`
- **Deskripsi:** Mengunggah gambar pengaduan atau foto profil ke bucket dbimg.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <access_token>`
  - `Content-Type: image/jpeg`
- **Path:** `public/<user_id>/<file_name>.jpg` (contoh: public/123e4567/complaint_1698765432.jpg)
- **Body:** File gambar (format JPG, maksimum 5MB).
- **Response:**
  - 200 OK:
    ```json
    { "Key": "public/<user_id>/<file_name>.jpg" }
    ```
  - 400 Bad Request:
    ```json
    { "error": "Gagal mengunggah gambar" }
    ```

#### 5.2. Mendapatkan URL Gambar Publik

- **Endpoint:** `GET /storage/v1/object/public/dbimg/<path>`
- **Deskripsi:** Mengambil URL publik untuk gambar yang diunggah.
- **Header:**
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
- **Response:**
  - 200 OK: Mengembalikan URL publik (contoh: https://<project-id>.supabase.co/storage/v1/object/public/dbimg/public/<user_id>/<file_name>.jpg).
