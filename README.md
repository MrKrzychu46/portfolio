# 📁 Portfolio Krzysztofa Łyszczarza

Projekt portfolio prezentujący moje umiejętności, projekty oraz dane kontaktowe. Strona została wykonana w HTML, CSS (Tailwind) oraz JavaScript, zawiera dynamiczne pobieranie i filtrowanie wiadomości, streszczenie artykułów przez AI oraz formularz kontaktowy.

---

## 🧱 Struktura projektu

```
.
├── index.html             # Strona główna (bio, projekty, technologie)
├── kolumny.html           # Lista projektów w formie trzech kolumn
├── lista.html             # Dynamiczna lista wiadomości z API
├── szczegoly.html         # Szczegóły pojedynczej wiadomości z użyciem AI
├── dodatkowa.html         # Formularz kontaktowy
├── css/
│   └── style.css          # Podstawowe style i układ strony
├── js/
│   └── script.js          # Skrypt obsługujący interakcje i dynamiczne dane
└── IMG/
    └── Logo.png           # Logo strony
    └── Profilowe.png      # Zdjęcie profilowe
└── CV
    └── CV_KL_2025.pdf      # Moje CV
```

---

## 🖥️ Technologie

- HTML5
- CSS3 + Tailwind CSS
- JavaScript (Vanilla)
- API: [Mediastack News API](https://mediastack.com)
- Backend do streszczeń: `https://gpt-backend-cg0q.onrender.com/api/summarize`

---

## ✨ Funkcje

### 🔹 Strona główna (`index.html`)
- Bio i zdjęcie profilowe
- Sekcja z projektami i technologiami
- Linki do GitHub, LinkedIn i pobrania CV

### 🔹 Moje projekty (`kolumny.html`)
- Trzy kolumny z projektami:
  - Centuś (Android)
  - RentGame (Java Spring Boot)
  - SummaryAI (API z AI)

### 🔹 Wiadomości (`lista.html`)
- Pobieranie newsów z zewnętrznego API
- Filtrowanie, sortowanie, paginacja
- Responsive design (widok tabeli i kart)
- Linki do szczegółów artykułów

### 🔹 Szczegóły artykułu (`szczegoly.html`)
- Pobranie pełnego URL z parametrów
- Wysłanie do backendu AI i wyświetlenie streszczenia

### 🔹 Formularz kontaktowy (`dodatkowa.html`)
- Symulowane wysyłanie wiadomości
- Formularz: imię, e-mail, wiadomość
- Obsługa przez JS z symulacją opóźnienia

---

## 📜 Skrypty (`script.js`)

- Obsługa dynamicznego renderowania wiadomości (fetch, filtracja, sortowanie, paginacja)
- Obsługa streszczeń artykułów poprzez zapytanie POST
- Hamburger menu (mobile navigation)
- Obsługa formularza kontaktowego (symulacja)

---

## 🎨 Stylowanie (`style.css`)

- Ustawienie wysokości i marginesów
- Flexbox i responsywność (media queries)
- Padding dostosowany do szerokości ekranu

---

## 📌 Autor

**Krzysztof Łyszczarz**
- GitHub: [MrKrzychu46](https://github.com/MrKrzychu46)
- LinkedIn: [Profil](https://www.linkedin.com/in/krzysztof-%C5%82yszczarz-57a077251/)
- CV: [Pobierz CV](cv/CV_KL_2025.pdf)

---

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT.
