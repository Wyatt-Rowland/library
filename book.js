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
        bookEl.innerHTML = `
        <h1 class="bookName input">${book.title}</h1>
        <img class="bookImg" src="${book.pic}" alt="Book Image" onerror="this.onerror=null; this.src='download.jfif';">
        <h2 class="bookAuthor input">${book.author}</h2>
        <p class="pageCount input">${book.page}</p>
        <p class="read input">${book.read ? "Read": "Not Read Yet"}</p>
        <button class="toggleBtn" onclick="toggleRead(${i})">Toggle</button>
        <button class="removeBtn" onclick="removeBook(${i})">Remove</button>
        `
        libraryEl.appendChild(bookEl);
    }
};

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