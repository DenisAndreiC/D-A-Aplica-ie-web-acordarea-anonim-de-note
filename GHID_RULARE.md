# Ghid de Rulare - Aplicație Acordare Note Anonime

## 🚀 Pornire Rapidă (O singură comandă)

Am creat un script special care face totul pentru tine (instalează ce lipsește și pornește ambele servere).

1.  Deschide terminalul în folderul proiectului.
2.  Rulează comanda:
    ```bash
    ./start.sh
    ```
3.  Asta e tot! Aplicația se va deschide la `http://localhost:5173`.

---

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
