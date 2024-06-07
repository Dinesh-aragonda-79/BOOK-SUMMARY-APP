// For index.html
document.getElementById('search-button')?.addEventListener('click', searchBooks);
document.getElementById('close-search')?.addEventListener('click', closeSearch);

// For custom.html
document.getElementById('add-summary-form')?.addEventListener('submit', addSummary);

function searchBooks() {
    const query = document.getElementById('search-input').value;
    if (!query) return;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';
            data.items.forEach(item => {
                const book = item.volumeInfo;
                const bookElement = document.createElement('div');
                bookElement.classList.add('book');
                bookElement.innerHTML = `
                    <h2>${book.title}</h2>
                    <h3>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</h3>
                    <p>${book.description ? book.description : 'No description available'}</p>
                    <button onclick="saveBook('${book.title}', '${book.authors ? book.authors.join(', ') : 'Unknown Author'}', '${book.description ? book.description.replace(/'/g, "\\'") : 'No description available'}')">Save Book</button>
                `;
                bookList.appendChild(bookElement);
            });
            document.getElementById('close-search').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}

function closeSearch() {
    document.getElementById('book-list').innerHTML = '';
    document.getElementById('search-input').value = '';
    document.getElementById('close-search').style.display = 'none';
}

function saveBook(title, author, description) {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    savedBooks.push({ title, author, description });
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    displaySavedBooks();
}

function displaySavedBooks() {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    const savedBooksList = document.getElementById('saved-books-list');
    if (savedBooksList) {
        savedBooksList.innerHTML = '';
        savedBooks.forEach((book, index) => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('saved-book');
            bookElement.innerHTML = `
                <h2>${book.title}</h2>
                <h3>${book.author}</h3>
                <p>${book.description}</p>
                <div class="buttons">
                    <button onclick="editBook(${index})">Edit</button>
                    <button onclick="deleteBook(${index})">Delete</button>
                </div>
            `;
            savedBooksList.appendChild(bookElement);
        });
    }
}

function editBook(index) {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    const book = savedBooks[index];
    const newTitle = prompt('Enter new title:', book.title);
    const newAuthor = prompt('Enter new author:', book.author);
    const newDescription = prompt('Enter new description:', book.description);

    if (newTitle && newAuthor && newDescription) {
        savedBooks[index] = { title: newTitle, author: newAuthor, description: newDescription };
        localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
        displaySavedBooks();
    }
}

function deleteBook(index) {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    savedBooks.splice(index, 1);
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    displaySavedBooks();
}

function addSummary(event) {
    event.preventDefault();
    const bookName = document.getElementById('book-name').value;
    const bookAuthor = document.getElementById('book-author').value;
    const bookSummary = document.getElementById('book-summary').value;
    const customBooks = JSON.parse(localStorage.getItem('customBooks')) || [];
    customBooks.push({ title: bookName, author: bookAuthor, description: bookSummary });
    localStorage.setItem('customBooks', JSON.stringify(customBooks));
    displayCustomBooks();
    document.getElementById('add-summary-form').reset();
}

function displayCustomBooks() {
    const customBooks = JSON.parse(localStorage.getItem('customBooks')) || [];
    const customBooksList = document.getElementById('manual-saved-books-list');
    if (customBooksList) {
        customBooksList.innerHTML = '';
        customBooks.forEach((book, index) => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('saved-book');
            bookElement.innerHTML = `
                <h2>${book.title}</h2>
                <h3>${book.author}</h3>
                <p>${book.description}</p>
                <div class="buttons">
                    <button onclick="editCustomBook(${index})">Edit</button>
                    <button onclick="deleteCustomBook(${index})">Delete</button>
                </div>
            `;
            customBooksList.appendChild(bookElement);
        });
    }
}

function editCustomBook(index) {
    const customBooks = JSON.parse(localStorage.getItem('customBooks')) || [];
    const book = customBooks[index];
    const newTitle = prompt('Enter new title:', book.title);
    const newAuthor = prompt('Enter new author:', book.author);
    const newDescription = prompt('Enter new description:', book.description);

    if (newTitle && newAuthor && newDescription) {
        customBooks[index] = { title: newTitle, author: newAuthor, description: newDescription };
        localStorage.setItem('customBooks', JSON.stringify(customBooks));
        displayCustomBooks();
    }
}

function deleteCustomBook(index) {
    const customBooks = JSON.parse(localStorage.getItem('customBooks')) || [];
    customBooks.splice(index, 1);
    localStorage.setItem('customBooks', JSON.stringify(customBooks));
    displayCustomBooks();
}

document.addEventListener('DOMContentLoaded', () => {
    displaySavedBooks();
    displayCustomBooks();
});
