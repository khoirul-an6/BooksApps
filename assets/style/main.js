let books = [];
const KEY = "BOOK_APPS";
const RENDER = "render-book";
const saved = "save-book";

function check() {
  return typeof (Storage !== "undefined");
}

function save() {
  if (check()) {
    const json = JSON.stringify(books);
    localStorage.setItem(KEY, json);
    document.dispatchEvent(new Event(saved));
  }
}

function creatId() {
  return +new Date();
}

function saveBooks() {
  if (check()) {
    const id = creatId();
    const title = document.getElementById("judulBuku").value;
    const author = document.getElementById("penulisBuku").value;
    const year = document.getElementById("tahunBuku").value;
    const finish = document.getElementById("selesaiBaca").checked;

    if (localStorage.getItem(KEY) !== null) {
      books = JSON.parse(localStorage.getItem(KEY));
    }

    books.unshift({
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: finish,
    });
    localStorage.setItem(KEY, JSON.stringify(books));
  }
  document.dispatchEvent(new Event(RENDER));
  save();
}

function findBooks(idBooks) {
  for (const i of books) {
    if (i.id === idBooks) {
      return i;
    }
  }
  return null;
}

function findIndexBook(idBooks) {
  for (const i in books) {
    if (books[i].id === idBooks) {
      return i;
    }
  }
  return -1;
}

function creatCard(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun buku: ${year}`;

  const divT = document.createElement("div");
  divT.classList.add("tumbnail");
  divT.append(textAuthor, textYear);

  const h4 = document.createElement("h4");
  h4.innerText = title;

  const divText = document.createElement("div");
  divText.classList.add("teks");
  divText.append(h4, divT);

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("id", `${id}`);
  card.append(divText);
  if (isComplete) {
    const imgRefres = document.createElement("img");
    imgRefres.setAttribute("src", "assets/img/refresh.png");
    imgRefres.addEventListener("click", function () {
      undoFromFinished(id);
    });

    const imgDelete = document.createElement("img");
    imgDelete.setAttribute("src", "assets/img/delete.png");
    imgDelete.addEventListener("click", function () {
      deleteData(id);
    });

    const divIcon = document.createElement("div");
    divIcon.classList.add("icon");
    divIcon.append(imgRefres, imgDelete);
    card.append(divIcon);
  } else {
    const imgCheck = document.createElement("img");
    imgCheck.setAttribute("src", "assets/img/check.png");
    imgCheck.addEventListener("click", function () {
      addFinish(id);
    });

    const imgDelete = document.createElement("img");
    imgDelete.setAttribute("src", "assets/img/delete.png");
    imgDelete.addEventListener("click", function () {
      deleteData(id);
    });
    const divIcon = document.createElement("div");
    divIcon.classList.add("icon");
    divIcon.append(imgCheck, imgDelete);
    card.append(divIcon);
  }
  return card;
}

function clearForm() {
  document.getElementById("judulBuku").value = "";
  document.getElementById("penulisBuku").value = "";
  document.getElementById("tahunBuku").value = "";
  document.getElementById("selesaiBaca").checked = false;
}

function searching() {
  const search = document.getElementById("src").value.toUpperCase();
  const card = document.getElementsByClassName("card");
  for (let index = 0; index < card.length; index++) {
    const title = card[index].getElementsByTagName("h4");
    const p = card[index].getElementsByTagName("p");
    if (
      title[0].innerHTML.toUpperCase().indexOf(search) > -1 ||
      p[0].innerHTML.toUpperCase().indexOf(search) > -1
    ) {
      card[index].style.display = "";
    } else {
      card[index].style.display = "none";
    }
  }
}

function addFinish(idBooks) {
  const BTarget = findBooks(idBooks);
  if (BTarget == null) return;

  BTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER));
  save();
}

function removeBook(idBooks) {
  const BTarget = findIndexBook(idBooks);

  if (BTarget === -1) return;

  books.splice(BTarget, 1);
  document.dispatchEvent(new Event(RENDER));
  save();
}

function deleteData(id) {
  swal({
    title: "Apakah kamu yakin?",
    text: "Buku akan dihapus dari rak..!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      removeBook(id);
      swal({
        title: "Succes!",
        text: "Buku berhasil dihapus",
        icon: "success",
      });
    } else {
      swal("Buku aman tidak jadi dihapus!");
    }
  });
}

function undoFromFinished(idBooks) {
  const target = findBooks(idBooks);

  if (target == null) return;
  target.isComplete = false;
  document.dispatchEvent(new Event(RENDER));
  save();
}

function loadBook() {
  let data = JSON.parse(localStorage.getItem(KEY));

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER));
}

function succesModal() {
  swal({
    title: "Succes!",
    text: "Buku berhasil ditambahkan",
    icon: "success",
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("btn-submit");

  submitBook.addEventListener("click", function (event) {
    event.preventDefault();
    saveBooks();
    clearForm();
    succesModal();
  });

  if (check()) {
    loadBook();
  }
});

document.addEventListener(RENDER, function () {
  const selesai = document.getElementById("completed");
  const belumSelesai = document.getElementById("uncompleted");

  selesai.innerHTML = "";
  belumSelesai.innerHTML = "";

  for (const bookItem of books) {
    const cardBooks = creatCard(bookItem);
    if (bookItem.isComplete) {
      selesai.append(cardBooks);
    } else {
      belumSelesai.append(cardBooks);
    }
  }
});
