const baseUrl = "http://localhost:3000";

async function api(path, opts) {
  opts = opts || {};
  opts.headers = opts.headers || {};

  // Attach tokens if present
  const studentToken = localStorage.getItem("studentToken");
  const adminToken = localStorage.getItem("adminToken");
  if (studentToken) opts.headers["Authorization"] = "Bearer " + studentToken;
  if (adminToken) opts.headers["Authorization"] = "Bearer " + adminToken;

  const res = await fetch(baseUrl + path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

// Student register
async function studentRegister(e) {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const r = await api("/api/student/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  alert(r.data.message || "Registered");
  if (r.ok) window.location.href = "student-login.html";
}

// Student login
async function studentLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const r = await api("/api/student/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (r.ok && r.data.token) {
    localStorage.setItem("studentToken", r.data.token);
    localStorage.setItem("studentName", r.data.username || r.data.name || "Student");
    window.location.href = "student-dashboard.html";
  } else {
    alert(r.data.message || "Login failed");
  }
}

// Admin login
async function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  const r = await api("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (r.ok && r.data.token) {
    localStorage.setItem("adminToken", r.data.token);
    window.location.href = "admin-dashboard.html";
  } else {
    alert(r.data.message || "Admin login failed");
  }
}

// Add book
async function addBook(e) {
  e.preventDefault();
  const title = document.getElementById("bTitle").value;
  const author = document.getElementById("bAuthor").value;
  const isbn = document.getElementById("bISBN").value;
  const genre = document.getElementById("bGenre").value;
  const copies = Number(document.getElementById("bCopies").value) || 1;

  const r = await api("/api/books/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, isbn, genre, copies }),
  });

  alert(r.data.message || "Added");
  if (r.ok) document.getElementById("bookForm").reset();
}

// Load books for browse page
async function loadBooks() {
  const r = await api("/api/books");
  const tbody = document.querySelector("#bookTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (!r.ok) {
    tbody.innerHTML = '<tr><td colspan="4">Could not load books</td></tr>';
    return;
  }

  (r.data || []).forEach((book) => {
    tbody.innerHTML += `<tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.copies}</td>
      <td><button class='btn' onclick="requestBorrow('${book._id}')">Request</button></td>
    </tr>`;
  });
}

// Request borrow
async function requestBorrow(bookId) {
  const studentName = localStorage.getItem("studentName");
  if (!studentName) return alert("Please login first");

  const r = await api("/api/requests/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, student: studentName }),
  });

  alert(r.data.message || (r.ok ? "Request sent" : "Failed to send request"));
}

// Student dashboard: load my requests & loans
async function loadStudentDashboard() {
  const nameElem = document.getElementById("stuName");
  if (nameElem) nameElem.textContent = localStorage.getItem("studentName") || "Student";

  const r1 = await api("/api/requests");
  const r2 = await api("/api/loans");
  const reqT = document.querySelector("#myRequests tbody");
  const loanT = document.querySelector("#myLoans tbody");

  if (reqT) {
    reqT.innerHTML = "";
    (r1.data || [])
      .filter((x) => x.student === localStorage.getItem("studentName") || true)
      .forEach((q) => {
        reqT.innerHTML += `<tr><td>${q.bookTitle}</td><td>${q.date}</td><td>${q.status}</td></tr>`;
      });
  }

  if (loanT) {
    loanT.innerHTML = "";
    (r2.data || [])
      .filter((x) => x.student === localStorage.getItem("studentName") || true)
      .forEach((l) => {
        loanT.innerHTML += `<tr><td>${l.bookTitle}</td><td>${l.borrowed}</td><td>${l.due}</td><td>${l.returned || "-"}</td></tr>`;
      });
  }
}

// Admin dashboard: load students, requests, loans, books
async function loadAdminDashboard() {
  const s = await api("/api/student/all");
  const r = await api("/api/requests");
  const b = await api("/api/books");
  const l = await api("/api/loans");
  const stBody = document.querySelector("#studentsTable tbody");
  const reqBody = document.querySelector("#reqTable tbody");
  const booksBody = document.querySelector("#booksTable tbody");

  if (stBody) {
    stBody.innerHTML = "";
    (s.data || []).forEach((st) => {
      stBody.innerHTML += `<tr><td>${st.username || st.name || ""}</td><td>${st.email}</td></tr>`;
    });
  }

  if (reqBody) {
    reqBody.innerHTML = "";
    (r.data || [])
      .filter((x) => x.status === "pending")
      .forEach((q) => {
        reqBody.innerHTML += `<tr>
          <td>${q.student}</td>
          <td>${q.bookTitle}</td>
          <td>${q.date}</td>
          <td>
            <button onclick="approveReq('${q._id}')">Approve</button>
            <button onclick="denyReq('${q._id}')">Deny</button>
          </td>
        </tr>`;
      });
  }

  if (booksBody) {
    booksBody.innerHTML = "";
    (b.data || []).forEach((bb) => {
      booksBody.innerHTML += `<tr>
        <td>${bb.title}</td>
        <td>${bb.author}</td>
        <td>${bb.isbn || ""}</td>
        <td>${bb.copies}</td>
      </tr>`;
    });
  }
}

async function approveReq(id) {
  const r = await api("/api/requests/approve/" + id, { method: "PUT" });
  alert(r.data.message || "Done");
  loadAdminDashboard();
}

async function denyReq(id) {
  const r = await api("/api/requests/deny/" + id, { method: "PUT" });
  alert(r.data.message || "Done");
  loadAdminDashboard();
}

function logout() {
  localStorage.removeItem("studentToken");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("studentName");
  window.location.href = "student-login.html";
}

// Auto-run loaders based on presence of specific elements
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginEmail"))
    document.getElementById("loginForm")?.addEventListener("submit", studentLogin);
  if (document.getElementById("regUsername"))
    document.getElementById("regForm")?.addEventListener("submit", studentRegister);
  if (document.getElementById("adminEmail"))
    document.getElementById("adminForm")?.addEventListener("submit", adminLogin);
  if (document.getElementById("bookForm"))
    document.getElementById("bookForm")?.addEventListener("submit", addBook);
  if (document.getElementById("bookTable")) loadBooks();
  if (document.getElementById("stuName")) loadStudentDashboard();
  if (document.getElementById("reqTable")) loadAdminDashboard();
});
