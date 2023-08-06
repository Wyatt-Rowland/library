let myLibrary;

let storedLibrary = localStorage.getItem('myLibrary');
if (storedLibrary === null) {
    myLibrary = [];
} else {
    let parsedLibrary = JSON.parse(storedLibrary);
    myLibrary = parsedLibrary.map(book => {
        let newBook = Object.assign(new Book(), book);
        newBook.dateAdded = new Date(book.dateAdded);
        return newBook;
    });
}

function Book(title, author, pic, page, read) {
    this.title = title;
    this.author = author;
    this.pic = pic;
    this.page = page;
    this.read = read;
    this.dateAdded = new Date();
}

Book.prototype.toggleRead = function(){
    this.read = !this.read;
}

function toggleRead(index) {
    myLibrary[index].toggleRead();
    render();
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary)); 
}

function handleSearch() {
    const searchQuery = document.querySelector('.search').value.trim().toLowerCase();

    const filteredBooks = myLibrary.filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
        );

    render(filteredBooks);
}  
const searchInput = document.querySelector('.search');
searchInput.addEventListener('input', handleSearch);

const sortDrop = document.querySelector('.sort');
sortDrop.addEventListener('change', sortBooks);

function sortBooks() {
    const sortType = document.querySelector('.sort').value;
    switch (sortType) {
        case 'oldest':
            myLibrary.sort((a, b) => a.dateAdded - b.dateAdded);
            break;
        case 'newest':
            myLibrary.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'alphaTitle':
            myLibrary.sort(function (a, b) {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            });
            break;
        case 'alphaAuthor':
            myLibrary.sort(function (a, b) {
                if (a.author < b.author) {
                    return -1;
                }
                if (a.author > b.author) {
                    return 1;
                }
                return 0;
            });
            break;
        case 'length':
            myLibrary.sort(function (a, b) {
                if (a.page > b.page) {
                    return 1;
                }
                if (a.page < b.page) {
                    return -1;
                }
                return 0;
            })
    }
    render();
}

function render(books = myLibrary){
    let libraryEl = document.querySelector(".library");
    libraryEl.innerHTML = "";
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let bookEl = document.createElement('div')
        bookEl.classList.add('bookContainer')
        if(book.read) {
            bookEl.classList.add('read');
        } else {
            bookEl.classList.add('notRead')
        }
        bookEl.innerHTML = `
        <h1 id="bookName" class="bookName input ${book.read ? "read" : "notRead"}">${book.title}</h1>
        <img class="bookImg" src="${book.pic}" alt="Book Image" onerror="this.onerror=null; this.src='download.jfif';">
        <h2 class="bookAuthor input">${book.author}</h2>
        <p class="pageCount input">${book.page}</p>
        <p class="read input">${book.read ? "Read": "Not Read Yet"}</p>
        <button class="toggleBtn ${book.read ? "read" : "notRead"}" onclick="toggleRead(${i})">Change read status</button>
        <button class="removeBtn ${book.read ? "read" : "notRead"}" onclick="removeBook(${i})">Remove</button>
        `
        libraryEl.appendChild(bookEl);
    }
};


function clearForm() {
    document.querySelector('.getTitle').value = '';
    document.querySelector('.getAuthor').value = '';
    document.querySelector('.getPic').value = '';
    document.querySelector('.getCount').value = '';
    document.querySelector('.getStatus').checked = false;
}

let theme = document.querySelector('#selectMenu');

theme.addEventListener('change', function(){
    let selectedTheme = theme.value;

    if (selectedTheme === 'dark') {
        document.documentElement.style.setProperty('--main-color', 'rgb(42, 42, 42)');
        document.documentElement.style.setProperty('--secondary-color', 'lightblue');
        document.documentElement.style.setProperty('--main-gradient', 'rgb(42, 42, 42), lightblue');
        document.documentElement.style.setProperty('--secondary-gradient', 'lightblue, rgb(42, 42, 42)');
        document.documentElement.style.setProperty('--form-color', 'white');
    } else if (selectedTheme === 'light') {
        document.documentElement.style.setProperty('--main-color', 'lightblue');
        document.documentElement.style.setProperty('--secondary-color', 'rgb(42, 42, 42)');
        document.documentElement.style.setProperty('--secondary-gradient', 'rgb(42, 42, 42), lightblue');
        document.documentElement.style.setProperty('--main-gradient', 'lightblue, rgb(42, 42, 42)');
        document.documentElement.style.setProperty('--form-color', 'grey');
    } else if (selectedTheme === 'colorful') {
        document.documentElement.style.setProperty('--main-color', 'black');
        document.documentElement.style.setProperty('--secondary-color', 'red');
        document.documentElement.style.setProperty('--secondary-gradient', 'blue, orange');
        document.documentElement.style.setProperty('--main-gradient', 'orange, blue');
        document.documentElement.style.setProperty('--form-color', 'blue');
    }
});

function removeBook(index) {
    myLibrary.splice(index, 1);
    render();
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary)); 
}

function addBookToLibrary() {
    let title = document.querySelector('.getTitle').value;
    let author = document.querySelector('.getAuthor').value;
    let pic = document.querySelector('.getPic').value;
    let page = document.querySelector('.getCount').value;
    let read = document.querySelector('.getStatus').checked;
    
    if (!pic || pic.trim() === '' || pic === undefined) {
        pic = "download.jfif";
    }

    let newBook = new Book(title, author, pic, page, read);
    console.log(newBook.pic);
    myLibrary.push(newBook);
    render();
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));

    sortBooks();
    clearForm();
}

let newBookBtn = document.querySelector('#newBookBtn');
let newBookForm = document.querySelector('#newBookForm');

newBookBtn.addEventListener('click', function() {
    if (newBookForm.style.display === 'none' || newBookForm.style.display === '') {
        newBookForm.style.display = 'inline-block';
        newBookForm.style.opacity = '100%';
    } else {
        newBookForm.style.display = 'none';
        newBookForm.style.opacity = '0%';
    }
});

document.querySelector('#newBookForm').addEventListener('submit', function(){
    event.preventDefault();
    addBookToLibrary();
})

document.querySelector('.search').addEventListener('input', handleSearch);


render();