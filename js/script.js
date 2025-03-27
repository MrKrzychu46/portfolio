// script.js
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  // ===============================
  // STRONA LISTY
  // ===============================
  if (window.location.pathname.includes("lista.html")) {
    let currentPage = 1;
    const itemsPerPage = 5;
    let allData = [];
    let currentSortOrder = localStorage.getItem("sortOrder") || "asc";
    let sortBy = localStorage.getItem("sortBy") || "title";

    const fetchData = () => {
      fetch("https://api.mediastack.com/v1/news?access_key=bb3318bc4f4a5920fbf733df740c0549&limit=100&sort=published_desc")
        .then(response => response.json())
        .then(json => {
          allData = json.data || [];
          renderList();
        });
    };

    const renderList = () => {
      let filteredData = filterData(allData);
      let sortedData = sortData(filteredData);
      let paginatedData = paginateData(sortedData, currentPage, itemsPerPage);

      let content = `<h2>Lista Wiadomości</h2>
                     <div class="filters">
                         <input type="text" id="search" placeholder="Szukaj..." value="${localStorage.getItem("searchValue") || ""}">
                         <div class="sort-controls-mobile">
                             <label for="sort-select">Sortuj:</label>
                             <select id="sort-select">
                                 <option value="title" ${sortBy === "title" ? "selected" : ""}>Tytuł</option>
                                 <option value="source" ${sortBy === "source" ? "selected" : ""}>Źródło</option>
                             </select>
                             <button id="sort-toggle">${currentSortOrder === "asc" ? "⬆" : "⬇"}</button>
                         </div>
                     </div>`;

      if (window.innerWidth >= 1024) {
        content += `<table class="list-table">
                        <tr>
                            <th>Tytuł <button id="sort-title">${sortBy === "title" && currentSortOrder === "asc" ? "⬆" : "⬇"}</button></th>
                            <th>Źródło <button id="sort-source">${sortBy === "source" && currentSortOrder === "asc" ? "⬆" : "⬇"}</button></th>
                            <th>Link</th>
                        </tr>`;
        paginatedData.forEach(item => {
          const encodedURL = encodeURIComponent(item.url);
          content += `<tr>
                          <td>${item.title}</td>
                          <td>${item.source}</td>
                          <td><a href="szczegoly.html?url=${encodedURL}">Zobacz</a></td>
                      </tr>`;
        });
        content += `</table>`;
      } else {
        content += `<div class="list-items">`;
        paginatedData.forEach(item => {
          const encodedURL = encodeURIComponent(item.url);
          content += `<div class="list-item">
                          <h3>${item.title}</h3>
                          <p>Źródło: ${item.source}</p>
                          <a href="szczegoly.html?url=${encodedURL}">Zobacz</a>
                      </div>`;
        });
        content += `</div>`;
      }

      content += paginationControls(filteredData.length);
      main.innerHTML = content;
      addEventListeners();
    };

    const filterData = (data) => {
      let searchValue = (localStorage.getItem("searchValue") || "").toLowerCase();
      return data.filter(item => item.title.toLowerCase().includes(searchValue));
    };

    const sortData = (data) => {
      return [...data].sort((a, b) => {
        let valA = sortBy === "title" ? a.title : a.source;
        let valB = sortBy === "title" ? b.title : b.source;
        return currentSortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    };

    const paginateData = (data, page, perPage) => {
      let start = (page - 1) * perPage;
      return data.slice(start, start + perPage);
    };

    const paginationControls = (totalItems) => {
      let totalPages = Math.ceil(totalItems / itemsPerPage);
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      let controls = `<div class="pagination">`;

      if (startPage > 1) {
        controls += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
          controls += `<span>...</span>`;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        controls += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          controls += `<span>...</span>`;
        }
        controls += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
      }

      controls += `</div>`;
      return controls;
    };

    const addEventListeners = () => {
      document.getElementById("search")?.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          localStorage.setItem("searchValue", event.target.value.toLowerCase());
          renderList();
        }
      });

      document.getElementById("sort-title")?.addEventListener("click", () => {
        sortBy = "title";
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        localStorage.setItem("sortBy", sortBy);
        localStorage.setItem("sortOrder", currentSortOrder);
        renderList();
      });

      document.getElementById("sort-source")?.addEventListener("click", () => {
        sortBy = "source";
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        localStorage.setItem("sortBy", sortBy);
        localStorage.setItem("sortOrder", currentSortOrder);
        renderList();
      });

      document.getElementById("sort-select")?.addEventListener("change", (event) => {
        sortBy = event.target.value;
        localStorage.setItem("sortBy", sortBy);
        renderList();
      });

      document.getElementById("sort-toggle")?.addEventListener("click", () => {
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        localStorage.setItem("sortOrder", currentSortOrder);
        renderList();
      });

      document.querySelectorAll(".page-btn").forEach(button => {
        button.addEventListener("click", (event) => {
          currentPage = parseInt(event.target.dataset.page);
          renderList();
        });
      });
    };

    window.addEventListener("resize", renderList);
    fetchData();
  }

  // ===============================
  // STRONA SZCZEGÓŁÓW
  // ===============================
  if (window.location.pathname.includes("szczegoly.html")) {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");

    if (!url) {
      main.innerHTML = "<h2>Błąd: Brak adresu URL artykułu</h2>";
      return;
    }

    main.innerHTML = "<h2>Ładowanie artykułu...</h2><p>Proszę czekać...</p>";

    fetch("http://localhost:3001/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: decodeURIComponent(url) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.summary) {
          main.innerHTML = `<h2>Streszczenie artykułu</h2><p>${data.summary.replace(/\n/g, "<br>")}</p>`;
        } else {
          main.innerHTML = "<h2>Nie udało się pobrać artykułu</h2>";
        }
      })
      .catch(() => {
        main.innerHTML = "<h2>Błąd w komunikacji z serwerem</h2>";
      });
  }
});
