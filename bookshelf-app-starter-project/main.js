const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

document.addEventListener("DOMContentLoaded", function () {
  loadData();

  const form = document.getElementById("bookForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });
});

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const book = {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };

  books.push(book);

  saveData();
  renderBooks();

  document.getElementById("bookForm").reset();
}

function renderBooks(filteredBooks = null) {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const displayBooks = filteredBooks || books;

  displayBooks.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  });
}

function createBookElement(book) {
  const container = document.createElement("div");
  container.setAttribute("data-bookid", book.id);
  container.setAttribute("data-testid", "bookItem");

  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.innerText = "Penulis: " + book.author;

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.innerText = "Tahun: " + book.year;

  const buttonContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";

  toggleButton.addEventListener("click", function () {
    toggleBook(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.innerText = "Hapus Buku";

  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.innerText = "Edit Buku";

  editButton.addEventListener("click", function () {
    editBook(book.id);
  });

  buttonContainer.append(toggleButton, deleteButton, editButton);
  container.append(title, author, year, buttonContainer);

  return container;
}

function toggleBook(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  saveData();
  renderBooks();
}

function editBook(id) {
  const book = books.find((b) => b.id === id);

  const newTitle = prompt("Edit Judul", book.title);
  const newAuthor = prompt("Edit Penulis", book.author);
  const newYear = prompt("Edit Tahun", book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = Number(newYear);

    saveData();
    renderBooks();
  }
}

function searchBook() {
  const keyword = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(keyword)
  );

  renderBooks(filtered);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (data) {
    books = JSON.parse(data);
  }

  renderBooks();
}