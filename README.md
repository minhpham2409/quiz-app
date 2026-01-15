# 🎯 Quiz Master - Ứng dụng ôn tập thông minh

Ứng dụng web giúp bạn tạo và ôn tập câu hỏi trắc nghiệm với 2 chế độ học tập:
- **Practice Mode**: Làm bài tập với câu hỏi random, tự động lặp lại câu sai
- **Flashcard Mode**: Ôn tập tuần tự từ đầu đến cuối, lật card để xem đáp án

## 🚀 Công nghệ sử dụng

### Backend
- Express.js + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- React Query
- React Router
- Framer Motion

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 18
- PostgreSQL >= 14
- npm hoặc yarn

### Bước 1: Clone project
```bash
cd quiz-app
```

### Bước 2: Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Copy .env.example sang .env
cp .env.example .env

# Sửa file .env với thông tin database của bạn
# DATABASE_URL="postgresql://user:password@localhost:5432/quiz_app"

# Chạy migration để tạo database
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Bước 3: Setup Frontend

```bash
cd ../frontend

# Cài đặt dependencies
npm install

# Copy .env.example sang .env
cp .env.example .env

# File .env đã có sẵn cấu hình mặc định:
# VITE_API_URL=http://localhost:3000
```

## 🎮 Chạy ứng dụng

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend sẽ chạy tại: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại: http://localhost:5173

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📖 Hướng dẫn sử dụng

### 1. Đăng ký tài khoản
- Truy cập http://localhost:5173
- Click "Đăng ký ngay"
- Điền thông tin và tạo tài khoản

### 2. Thêm câu hỏi

**Cách 1: Thêm thủ công**
- Vào Dashboard
- Click "Thêm câu hỏi"
- Điền câu hỏi, 4 đáp án, chọn đáp án đúng
- Click "Thêm câu hỏi"

**Cách 2: Upload JSON**
- Tạo file JSON theo format:
```json
[
  {
    "question": "React là gì?",
    "a": "Framework",
    "b": "Library",
    "c": "Language",
    "d": "Database",
    "correct": "B"
  }
]
```
- Click "Chọn file JSON"
- Chọn file và upload

### 3. Practice Mode (Làm bài)
- Click "Làm bài tập"
- Chọn đáp án
- Nếu sai: Hiện đáp án đúng, câu sẽ xuất hiện lại sau
- Nếu đúng: Câu không xuất hiện nữa
- Click "Làm lại" để reset tiến độ

### 4. Flashcard Mode (Ôn tập)
- Click "Flashcard"
- **Mặt trước**: Hiện câu hỏi + 4 đáp án
- Click để lật card
- **Mặt sau**: Hiện đáp án đúng
- Dùng nút Previous/Next để điều hướng

## 🗄️ Database Schema

```sql
users
- id (UUID)
- email (unique)
- password_hash
- name
- created_at

questions
- id (UUID)
- user_id (FK)
- question_text
- answer_a, answer_b, answer_c, answer_d
- correct_answer (A/B/C/D)
- created_at, updated_at

user_progress
- id (UUID)
- user_id (FK)
- question_id (FK)
- is_correct (boolean)
- incorrect_count (int)
- last_attempted (timestamp)
```

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### Questions
- `GET /api/questions` - Lấy danh sách câu hỏi
- `POST /api/questions` - Tạo câu hỏi mới
- `POST /api/questions/bulk` - Upload nhiều câu hỏi
- `PUT /api/questions/:id` - Sửa câu hỏi
- `DELETE /api/questions/:id` - Xóa câu hỏi

### Practice
- `GET /api/practice/next` - Lấy câu hỏi tiếp theo
- `POST /api/practice/submit` - Nộp đáp án
- `GET /api/practice/stats` - Xem thống kê
- `POST /api/practice/reset` - Reset tiến độ

### Flashcard
- `GET /api/flashcard/all` - Lấy tất cả flashcard
- `GET /api/flashcard/:index` - Lấy flashcard theo index

## 🚀 Deploy

### Backend (Railway)
1. Push code lên GitHub
2. Tạo project trên Railway
3. Connect với GitHub repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### Frontend (Vercel)
1. Push code lên GitHub
2. Import project vào Vercel
3. Set `VITE_API_URL` với URL backend
4. Deploy

## 📝 Sample JSON

File mẫu để test upload:

```json
[
  {
    "question": "TypeScript là gì?",
    "a": "JavaScript framework",
    "b": "JavaScript superset với type checking",
    "c": "Ngôn ngữ lập trình mới",
    "d": "Database",
    "correct": "B"
  },
  {
    "question": "React Hook nào dùng để quản lý state?",
    "a": "useEffect",
    "b": "useContext",
    "c": "useState",
    "d": "useRef",
    "correct": "C"
  },
  {
    "question": "Express.js là gì?",
    "a": "Frontend framework",
    "b": "Backend framework cho Node.js",
    "c": "Database",
    "d": "CSS framework",
    "correct": "B"
  }
]
```

## 🎨 Features

✅ Đăng ký/Đăng nhập với JWT
✅ Thêm câu hỏi thủ công hoặc upload JSON
✅ Sửa/Xóa câu hỏi
✅ Practice mode với random câu hỏi
✅ Flashcard mode ôn tập tuần tự
✅ Theo dõi tiến độ học tập
✅ Reset progress để làm lại
✅ Responsive design
✅ Animation mượt mà

## 🤝 Liên hệ

Nếu có vấn đề gì, hãy tạo issue hoặc liên hệ!

---
Made with ❤️ using React, Express, and PostgreSQL
