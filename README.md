# Sistem de Acordare Anonimă de Note (Peer-to-Peer Grading)

> Aplicație SPA pentru acordarea anonimă de note între studenți (juriu), cu back-end RESTful și baza de date PostgreSQL.

---

## 📌 Scop

Permite evaluarea anonimă a proiectelor realizate de studenți — membrii proiectelor (MP) își înscriu livrabilele, iar un juriu (studenți aleși aleatoriu) acordă note anonime pe o perioadă limitată de timp. Profesorul are acces administrativ la toate notele și la identitatea evaluatorilor în zona de administrare (backend), dar nu în interfața publică.

## 👥 Echipa

* **Cucu Denis Andrei**
* **Buhaianu Alina**

## 📅 Livrabile și Termene

* **Faza 0 — 16.11.2025**: Specificații detaliate, plan de proiect, repo Git inițial.
* **Faza 1 — 06.12.2025**: Serviciu RESTful funcțional în repository + instrucțiuni de rulare.
* **Faza 2 — Ultimul seminar**: Aplicația completă (Demo).

---

## 🧩 Functionalități (Minime)

### A. Autentificare & Roluri

* **Profesor**: vizualizează toate proiectele și notele (anonime în UI); gestionează juriul și sesiunile.
* **MP (Membru Proiect)**: CRUD proiecte proprii; adaugă livrabile; este inclus automat în baza evaluatorilor.
* **Juriu (Evaluator)**: acordă/modifică doar propria notă pentru o perioadă limitată (ex: 72h); vede doar proiectele desemnate.

### B. MP

* Înregistrare proiect: titlu, descriere, membri.
* Adăugare sursă livrabil: link GitHub / demo / video.
* Vizualizare evaluare: status, note individuale (anonime) și notă finală.

### C. Juriu

* Selecție aleatorie a evaluatorilor (non-MP pentru proiectul respectiv).
* Acordare notă între **1.00** și **10.00** (max 2 zecimale).
* Note stocate anonim în interfața publică.
* Permite editarea notei doar în fereastra limitată (ex: 72 ore) după desemnare.

### D. Profesor

* Vizualizare detalii evaluare (toate notele pentru un proiect/livrabil).
* Calcul notă finală: media notelor după **omiterea** celei mai mari și celei mai mici note.
* Management permisiuni: poate vedea identitatea juriului în backend administrativ.

---

## 🏗️ Arhitectură & Tehnologii

* Front-end: **React.js** + **Tailwind CSS** (SPA)
* Back-end: **Node.js** + **Express** (RESTful API)
* Bază de date: **PostgreSQL**
* ORM: (Prisma) 
* Versionare: **Git** (commit-uri incrementale)

---

## 📋 Design orientativ — Ecrane cheie

* Ecran de Autentificare (Login / Register)
* Dashboard MP: lista proiectelor proprii, status notare, acțiuni
* Ecran Adăugare Livrabil: Titlu, Descriere, Data Scadență, Link-uri
* Dashboard Profesor: lista proiectelor, nota finală, buton gestionare juriu
* Ecran Evaluator: vizualizare livrabil + input validat pentru notă (1.00–10.00, 2 zecimale)

---

## 🛠️ Plan de implementare (detaliat)

### Faza 0 — Inițiere (până 16.11.2025)

* Finalizare specificații (acest document)
* Structură repo (backend/, frontend/, infra/)
* Configurare inițială Git + .
* README și issues inițiale

### Faza 1 — Serviciu RESTful (până 06.12.2025)

* Setare proiect Node.js/Express
* Config PostgreSQL + ORM
* Modele de bază: `User`, `Project`, `Deliverable`, `Grade`, `JuryAssignment`, `Role`
* Rute esențiale: autentificare, CRUD proiecte, endpoint-uri pentru notare
* Logică calcul notă finală (omiterea max/min)
* Documentație de rulare în `README.md`

### Faza 2 — Aplicația completă (Ultimul seminar)

* Frontend complet (React + Tailwind)
* Integrare API
* Implementare selecție aleatorie juriu
* Implementare fereastră de editare notă (ex: 72h)
* Tests / demo
