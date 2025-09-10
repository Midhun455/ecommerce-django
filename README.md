# 🛒 Ecommerce Django + React Project

## 📦 Features
- **Django REST Framework** backend
- **JWT authentication**
- **Stripe payment integration**
- **React frontend**
- **Dockerized setup with PostgreSQL**
- Ready for **local development** or **Docker deployment**

---

## ⚡ Manual Setup

### Backend (Django)
```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .example.env .env

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

Backend will be available at 👉 `http://127.0.0.1:8000`

---

### Frontend (React)
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Setup environment
cp .example.env .env

# Start development server
npm start
```

Frontend will be available at 👉 `http://localhost:3000`

---

## 🐳 Docker Setup (Recommended)
To run both **frontend + backend + Postgres** with one command:

```bash
docker-compose up --build
```

- Backend: `http://localhost:8000`  
- Frontend: `http://localhost:3000`  
- Postgres: exposed internally to containers  

---

## 🧪 Running Tests

### Backend
```bash
cd backend
pytest   # or python manage.py test
```

### Frontend
```bash
cd frontend
npm test
```

---

## 📄 API Documentation
- All API endpoints are documented in the **Postman collection**:  
  `docs/postman_collection.json`

---

## 🔑 Environment Variables
Example `.example.env` for both backend and frontend are included.  
Copy and update as needed:

```bash
cp backend/.example.env backend/.env
cp frontend/.example.env frontend/.env
```

---

## ✅ Project Checklist
- [x] Django backend with DRF + JWT  
- [x] React frontend  
- [x] Stripe integration  
- [x] PostgreSQL via Docker  
- [x] Example `.env` files included  
- [x] Postman collection for API testing  
