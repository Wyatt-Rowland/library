let myLibrary;

let storedLibrary = localStorage.getItem('myLibrary');
if (storedLibrary === null) {
    myLibrary = [];
} else {
    let parsedLibrary = JSON.parse(storedLibrary);
    myLibrary = parsedLibrary.map(book => Object.assign(new Book(), book));
}

function Book(title, author, pic, page, read) {
    this.title = title;
    this.author = author;
    this.pic = pic;
    this.page = page;
    this.read = read;
}

Book.prototype.toggleRead = function(){
    this.read = !this.read;
}

function toggleRead(index) {
    myLibrary[index].toggleRead();
    render();
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary)); 

}

function render(){
    let libraryEl = document.querySelector(".library");
    libraryEl.innerHTML = "";
    for (let i = 0; i < myLibrary.length; i++) {
        let book = myLibrary[i];
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
}

let newBookBtn = document.querySelector('#newBookBtn');
newBookBtn.addEventListener('click', function() {
    let newBookForm = document.querySelector('#newBookForm');
    newBookForm.style.display = 'inline-block';
})

document.querySelector('#newBookForm').addEventListener('submit', function(){
    event.preventDefault();
    addBookToLibrary();
})

render();