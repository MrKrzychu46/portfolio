document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  if (window.location.pathname.includes("lista.html")) {
    let currentPage = 1;
    const itemsPerPage = 5;
    let allData = [];
    let currentSortOrder = "asc";
    let sortBy = "title";

    const fetchData = () => {
      fetch("https://api.mediastack.com/v1/news?access_key=6aca8a0619aa0ffcb4726e4883bf41de")
        .then(response => response.json())
        .then(json => {
          allData = json.data || [];
          renderList();
        });
    };

    const renderList = () => {
      const filteredData = filterData(allData);
      const sortedData = sortData(filteredData);
      const paginatedData = paginateData(sortedData, currentPage, itemsPerPage);

      let content = `
        <h2 class="text-2xl font-semibold mb-6 text-center">Wiadomości</h2>
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <label for="sort-select" class="text-sm text-gray-600">Sortuj:</label>
            <select id="sort-select" class="px-2 py-1 border rounded-md">
              <option value="title" ${sortBy === "title" ? "selected" : ""}>Tytuł</option>
              <option value="source" ${sortBy === "source" ? "selected" : ""}>Źródło</option>
            </select>
            <button id="sort-toggle" class="px-2 py-1 border rounded-md bg-gray-100 hover:bg-gray-200">
              ${currentSortOrder === "asc" ? "⬆" : "⬇"}
            </button>
          </div>
        </div>
      `;

      if (filteredData.length === 0) {
        content += `<p class="text-gray-500 italic">Brak wyników pasujących do zapytania.</p>`;
        main.innerHTML = content;
        return;
      }

      if (window.innerWidth >= 1024) {
        content += `
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">
                    Tytuł
                    <button id="sort-title" class="ml-1 text-xs text-gray-500 hover:text-gray-800">${sortBy === "title" && currentSortOrder === "asc" ? "⬆" : "⬇"}</button>
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">
                    Źródło
                    <button id="sort-source" class="ml-1 text-xs text-gray-500 hover:text-gray-800">${sortBy === "source" && currentSortOrder === "asc" ? "⬆" : "⬇"}</button>
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">Link</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
        `;

        paginatedData.forEach(item => {
          const encodedURL = encodeURIComponent(item.url);
          content += `
            <tr>
              <td class="px-4 py-2">${item.title}</td>
              <td class="px-4 py-2">${item.source}</td>
              <td class="px-4 py-2">
                <a href="szczegoly.html?url=${encodedURL}" class="text-indigo-600 hover:underline">Zobacz</a>
              </td>
            </tr>
          `;
        });

        content += `
              </tbody>
            </table>
          </div>
        `;
      } else {
        content += `<div class="grid gap-4">`;
        paginatedData.forEach(item => {
          const encodedURL = encodeURIComponent(item.url);
          content += `
            <div class="border rounded-md p-4 shadow-sm bg-white">
              <h3 class="font-semibold text-lg mb-2">${item.title}</h3>
              <p class="text-sm text-gray-600 mb-2">Źródło: ${item.source}</p>
              <a href="szczegoly.html?url=${encodedURL}" class="text-indigo-600 hover:underline text-sm">Zobacz</a>
            </div>
          `;
        });
        content += `</div>`;
      }

      content += paginationControls(filteredData.length);
      main.innerHTML = content;
      addEventListeners();
    };

    const filterData = (data) => {
      const inputDesktop = document.getElementById("navbar-search");
      const inputMobile = document.getElementById("navbar-search-mobile");
      const searchValue = (inputDesktop?.value || inputMobile?.value || "").toLowerCase();
      return data.filter(item => item.title.toLowerCase().includes(searchValue));
    };

    const sortData = (data) => {
      return [...data].sort((a, b) => {
        const valA = sortBy === "title" ? a.title : a.source;
        const valB = sortBy === "title" ? b.title : b.source;
        return currentSortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    };

    const paginateData = (data, page, perPage) => {
      const start = (page - 1) * perPage;
      return data.slice(start, start + perPage);
    };

    const paginationControls = (totalItems) => {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, startPage + 2);

      let controls = `<div class="mt-6 flex flex-wrap items-center justify-center gap-2">`;

      if (startPage > 1) {
        controls += `<button class="page-btn px-3 py-1 rounded-md border text-sm bg-white text-gray-700 hover:bg-gray-100" data-page="1">1</button>`;
        if (startPage > 2) {
          controls += `<span class="px-2 text-gray-400">...</span>`;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        controls += `<button class="page-btn px-3 py-1 rounded-md border text-sm ${isActive ? "bg-gray-800 text-white font-semibold" : "bg-white text-gray-700 hover:bg-gray-100"}" data-page="${i}">${i}</button>`;
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          controls += `<span class="px-2 text-gray-400">...</span>`;
        }
        controls += `<button class="page-btn px-3 py-1 rounded-md border text-sm bg-white text-gray-700 hover:bg-gray-100" data-page="${totalPages}">${totalPages}</button>`;
      }

      controls += `</div>`;
      return controls;
    };

    const addEventListeners = () => {
      const searchInputs = [document.getElementById("navbar-search"), document.getElementById("navbar-search-mobile")];

      searchInputs.forEach(input => {
        input?.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            currentPage = 1;
            renderList();
          }
        });
      });

      document.getElementById("sort-title")?.addEventListener("click", () => {
        sortBy = "title";
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        renderList();
      });

      document.getElementById("sort-source")?.addEventListener("click", () => {
        sortBy = "source";
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        renderList();
      });

      document.getElementById("sort-select")?.addEventListener("change", (event) => {
        sortBy = event.target.value;
        renderList();
      });

      document.getElementById("sort-toggle")?.addEventListener("click", () => {
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
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

    fetch("https://gpt-backend-cg0q.onrender.com/api/summarize", {
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

  // ===============================
  // MOBILE MENU TOGGLE
  // ===============================
  const toggleButton = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconHamburger = document.getElementById("icon-hamburger");
  const iconClose = document.getElementById("icon-close");

  toggleButton?.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden");
    iconHamburger.classList.toggle("hidden");
    iconClose.classList.toggle("hidden");
  });
});
