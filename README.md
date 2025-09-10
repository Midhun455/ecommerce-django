# 🛒 Ecommerce Django + React Project

## 📦 Features
- Django REST Framework backend
- JWT authentication
- Stripe payment integration
- React frontend
- Dockerized setup with Postgres

---

## ⚡ Manual Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .example.env .env
python manage.py migrate
python manage.py runserver

### Frontend

cd frontend
npm install
cp .example.env .env
npm start

🐳 Docker Setup
docker-compose up --build

