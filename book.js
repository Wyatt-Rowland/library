// Initialize library from local storage or as empty if not present
let myLibrary;

let storedLibrary = localStorage.getItem('my-library');
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

// Book constructor
function Book(title, author, pic, page, read) {
    this.title = title;
    this.author = author;
    this.pic = pic;
    this.page = page;
    this.read = read;
    this.dateAdded = new Date();
}

// Prototype method to toggle read status
Book.prototype.toggleRead = function(){
    this.read = !this.read;
}

// Function to change read status and update the library and local storage
function toggleRead(index) {
    myLibrary[index].toggleRead();
    render();
    localStorage.setItem('my-library', JSON.stringify(myLibrary)); 
}

// Function to handle search input and render the filtered books
function handleSearch() {
    const searchQuery = document.querySelector('.search').value.trim().toLowerCase();

    const filteredBooks = myLibrary.filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
    );

    render(filteredBooks);
}

// Add event listener to the search input
const searchInput = document.querySelector('.search');
searchInput.addEventListener('input', handleSearch);

// Add event listener to the sort dropdown
const sortDrop = document.querySelector('.sort');
sortDrop.addEventListener('change', sortBooks);

// Function to sort books based on the selected type
function sortBooks() {
    const sortType = document.querySelector('.sort').value;
    switch (sortType) {
        case 'oldest':
            myLibrary.sort((a, b) => a.dateAdded - b.dateAdded);
            break;
        case 'newest':
            myLibrary.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'alpha-title':
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
        case 'alpha-author':
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
            });
            break;
    }
    render();
}

// Function to render the library books
function render(books = myLibrary){
    let libraryEl = document.querySelector(".library");
    libraryEl.innerHTML = "";
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let bookEl = document.createElement('div')
        bookEl.classList.add('book-container')
        if(book.read) {
            bookEl.classList.add('read');
        } else {
            bookEl.classList.add('not-read')
        }
        bookEl.innerHTML = `
        <h1 id="book-name" class="book-name input ${book.read ? "read" : "not-read"}">${book.title}</h1>
        <img class="book-img" src="${book.pic}" alt="Book Image" onerror="this.onerror=null; this.src='download.jfif';">
        <h2 class="book-author input">${book.author}</h2>
        <p class="page-count input">${book.page}</p>
        <p class="read input">${book.read ? "Read": "Not Read Yet"}</p>
        <button class="toggle-btn ${book.read ? "read" : "not-read"}" onclick="toggleRead(${i})">Change read status</button>
        <button class="remove-btn ${book.read ? "read" : "not-read"}" onclick="removeBook(${i})">Remove</button>
        `
        libraryEl.appendChild(bookEl);
    }
};

// Function to show the form
function showForm() {
    let form = document.querySelector('#new-book-form');
    form.classList.add('active');
    form.style.opacity = 1;
}

// Function to hide the form
function hideForm() {
    let form = document.querySelector('#new-book-form');
    form.classList.remove('active');
    form.style.transition = 'all 0.5s ease-in-out';
    form.style.opacity = 0;
    form.style.transform = 'scale(-50px)';
}

// Function to clear the form
function clearForm() {
    document.querySelector('.get-title').value = '';
    document.querySelector('.get-author').value = '';
    document.querySelector('.get-pic').value = '';
    document.querySelector('.get-count').value = '';
    document.querySelector('.get-status').checked = false;
}

// Add event listener to the theme selection dropdown
let theme = document.querySelector('#select-menu');
theme.addEventListener('change', function(){
    let selectedTheme = theme.value;

    // Change colors based on the selected theme
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

// Function to remove a book from the library and update the library and local storage
function removeBook(index) {
    myLibrary.splice(index, 1);
    render();
    localStorage.setItem('my-library', JSON.stringify(myLibrary)); 
}

// Function to add a book to the library, update the library and local storage, and clear the form
function addBookToLibrary(e) {
    e.preventDefault();

    let title = document.querySelector('.get-title').value;
    let author = document.querySelector('.get-author').value;
    let pic = document.querySelector('.get-pic').value;
    let page = document.querySelector('.get-count').value;
    let read = document.querySelector('.get-status').checked;
    
    if (!pic || pic.trim() === '' || pic === undefined) {
        pic = "download.jfif";
    }

    let newBook = new Book(title, author, pic, page, read);
    myLibrary.push(newBook);
    render();
    localStorage.setItem('my-library', JSON.stringify(myLibrary));

    sortBooks();
    clearForm();
}

let newBookBtn = document.querySelector('#new-book-btn');
let newBookForm = document.querySelector('#new-book-form');

newBookBtn.addEventListener('click', function() {
    if (!newBookForm.classList.contains('active')) {
        showForm();
    } else {
        hideForm();
    }
});

document.querySelector('#new-book-form').addEventListener('submit', function(e){
    e.preventDefault();
    addBookToLibrary(e);
})

document.querySelector('.search').addEventListener('input', handleSearch);

render();