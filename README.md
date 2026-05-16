# Mini Service Request Board - GlobalTNA Assessment

A streamlined, full-stack trade platform where homeowners can seamlessly post service requests, and tradespeople can browse listings, filter by industry category, view specific task details, update assignment statuses, and delete entries.

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Node.js + Express REST API
- **Database:** MongoDB Atlas (Cloud Tier via Mongoose ODM)

---

## 🔑 System Environment Configurations

### 1. Backend Environment Setup (`/backend/.env`)
Create a file named `.env` inside the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string