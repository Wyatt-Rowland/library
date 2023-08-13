// Book constructor
const bookModule = (function() {
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
    };
    return {
        Book: Book
    };
})();

// Initialize library from local storage or as empty if not present
const libraryModule = (function() {
    let library = [];

    function initialize() {
        let storedLibrary = localStorage.getItem('library');
        if (storedLibrary === null) {
            library = [];
        } else {
            let parsedLibrary = JSON.parse(storedLibrary);
            library = parsedLibrary.map(book => {
                let newBook = new bookModule.Book(book.title, book.author, book.pic, book.page, book.read);
                newBook.dateAdded = new Date(book.dateAdded);
                return newBook;
            });
        }
    }

    function getLibrary() {
        return library;
    }

    function addBook(book) {
        library.push(book);
        localStorage.setItem('library', JSON.stringify(library));
    }

    function removeBookAt(index) {
        library.splice(index, 1);
        localStorage.setItem('library', JSON.stringify(library));
    }
    
    initialize();

    return {
        getLibrary: getLibrary,
        addBook: addBook,
        removeBookAt: removeBookAt
    };
})();



const domElements = (function () {
    const inputInfo = document.querySelector('#new-book-form');
    const newBookBtn = document.querySelector('#new-book-btn');
    const searchInput = document.querySelector('.search-container');
    let theme = document.querySelector('#select-menu');

    return {
        inputInfo,
        newBookBtn,
        searchInput,
        theme
    }
})();

// Function to change read status and update the library and local storage
const toggleModule = (function() {
    function toggleRead(index) {
        let book = libraryModule.getLibrary()[index];
        book.toggleRead();
        renderObject.render();
        localStorage.setItem('library', JSON.stringify(libraryModule.getLibrary())); 
    }
    return {
        toggleRead: toggleRead
    };
})();


// Function to handle search input and render the filtered books
function handleSearch() {
    const searchQuery = domElements.searchInput.querySelector('.search').value.trim().toLowerCase();

    const filteredBooks = libraryModule.getLibrary().filter(book =>
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
    );

    renderObject.render(filteredBooks);
}

// Add event listener to the search input
domElements.searchInput.addEventListener('input', handleSearch);



// Function to sort books based on the selected type
const sortModule = (function() {
    function sortBooks() {
        const sortType = sortDrop.value;
        switch (sortType) {
            case 'oldest':
                libraryModule.getLibrary().sort((a, b) => a.dateAdded - b.dateAdded);
                break;
            case 'newest':
                libraryModule.getLibrary().sort((a, b) => b.dateAdded - a.dateAdded);
                break;
            case 'alpha-title':
                libraryModule.getLibrary().sort(function (a, b) {
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
                libraryModule.getLibrary().sort(function (a, b) {
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
                libraryModule.getLibrary().sort(function (a, b) {
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
        renderObject.render();
    }
    return {
        sortBooks: sortBooks
    }
})();

const sortDrop = domElements.searchInput.querySelector('.sort');
sortDrop.addEventListener('change', sortModule.sortBooks);

document.querySelector(".library").addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-btn')) {
        let index = event.target.getAttribute('data-index');
        toggleModule.toggleRead(index);
    } else if (event.target.classList.contains('remove-btn')) {
        let index = event.target.getAttribute('data-index');
        removeModule.removeBook(index);
    }
});

// Function to render the library books


const createModule = (function () {
    function createElement(tag, attribute = {}, children = []) {
        const element = document.createElement(tag);
        for (let key in attribute) {
            if (key === "textContent") {
                element.textContent = attribute[key];
            } else {
                element.setAttribute(key, attribute[key]);
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    }
    return {
        createElement: createElement
    }
})();
    
const renderObject = {
    render: function(books = libraryModule.getLibrary()) {
        let libraryEl = document.querySelector(".library");
        
        // Clear the libraryEl first
        while (libraryEl.firstChild) {
            libraryEl.removeChild(libraryEl.firstChild);
        }

        books.forEach((book, i) => {
            const bookEl = createModule.createElement('div', {
                class: `book-container ${book.read ? 'read' : 'not-read'}`
            }, [
                createModule.createElement('h1', {
                    class: `book-name input ${book.read ? "read" : "not-read"}`,
                    textContent: book.title
                }),
                createModule.createElement('img', {
                    class: 'book-img',
                    src: book.pic,
                    alt: 'Book Image',
                    onerror: "this.src='download.jfif';"
                }),
                createModule.createElement('h2', { class: 'book-author input', textContent: book.author }),
                createModule.createElement('p', { class: 'page-count input', textContent: book.page }),
                createModule.createElement('p', { class: 'read input', textContent: book.read ? "Read" : "Not Read Yet" }),
                createModule.createElement('button', { class: 'toggle-btn', 'data-index': i, textContent: 'Change read status' }),
                createModule.createElement('button', { class: 'remove-btn', 'data-index': i, textContent: 'Remove' })
            ]);

            libraryEl.appendChild(bookEl);
        });
    }
};





// Function to show the form
const formControl = {

    showForm:  () => {
        domElements.inputInfo.classList.add('active');
        domElements.inputInfo.style.opacity = 1;
    },

    // Function to hide the form
    hideForm: () => {
        domElements.inputInfo.classList.remove('active');
        domElements.inputInfo.style.transition = 'all 0.5s ease-in-out';
        domElements.inputInfo.style.opacity = 0;
        domElements.inputInfo.style.transform = 'scale(-50px)';
    },

    // Function to clear the form
    clearForm: () => {

        domElements.inputInfo.querySelector('.get-title').value = '';
        domElements.inputInfo.querySelector('.get-author').value = '';
        domElements.inputInfo.querySelector('.get-pic').value = '';
        domElements.inputInfo.querySelector('.get-count').value = '';
        domElements.inputInfo.querySelector('.get-status').checked = false;
    }
};

    // Add event listener to the theme selection dropdown
    domElements.theme.addEventListener('change', function(){
        let selectedTheme = domElements.theme.value;

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
const removeModule = (function() {
    function removeBook(index) {
        libraryModule.removeBookAt(index);
        renderObject.render();
        localStorage.setItem('library', JSON.stringify(libraryModule.getLibrary())); 
    }
    return {
        removeBook: removeBook
    }
})(); 


// Function to add a book to the library
const addBook = (function() {
    function addBookToLibrary(e) {
        e.preventDefault();

        let title = domElements.inputInfo.querySelector('.get-title').value;
        let author = domElements.inputInfo.querySelector('.get-author').value;
        let pic = domElements.inputInfo.querySelector('.get-pic').value;
        let page = domElements.inputInfo.querySelector('.get-count').value;
        let read = domElements.inputInfo.querySelector('.get-status').checked;
        
        if (!pic || pic.trim() === '' || pic === undefined) {
            pic = "download.jfif";
        }

        let newBook = new bookModule.Book(title, author, pic, page, read);
        libraryModule.addBook(newBook)
        renderObject.render();

        sortModule.sortBooks();
        formControl.clearForm();
        formControl.hideForm();
    }
    return {
        addBookToLibrary: addBookToLibrary
    }
})();

domElements.newBookBtn.addEventListener('click', function() {
    if (!domElements.inputInfo.classList.contains('active')) {
        formControl.showForm();
    } else {
        formControl.hideForm();
    }
});

domElements.inputInfo.addEventListener('submit', function(e){
    e.preventDefault();
    addBook.addBookToLibrary(e);
})

domElements.searchInput.addEventListener('input', handleSearch);

renderObject.render();