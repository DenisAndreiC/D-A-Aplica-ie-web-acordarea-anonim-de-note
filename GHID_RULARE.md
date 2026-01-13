--

## 🛠 Configurare Manuală (Dacă vrei control total)

Dacă preferi să pornești manual sau scriptul nu merge, iată pașii clasici:

### 1. Baza de Date

- Asigură-te că ai PostgreSQL pornit.
- Creează o bază de date numită `grading_db` (prin pgAdmin 4).

### 2. Backend

```bash
cd backend
npm install
npx prisma db push  # Doar prima dată, pentru a crea tabelele
node index.js
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
