document.addEventListener('DOMContentLoaded', function () {
    const books = [];
    const RENDER_EVENT = 'render-bookshelf'
    const submitAddBook = document.getElementById('addBook');
    const SAVED_EVENT = 'saved-books';
    const STORAGE_KEY = 'BOOKSHELF_APPS';
    submitAddBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })

    function addBook() {
        const titleBook = document.getElementById('inputBookTitle').value;
        const authorBook = document.getElementById('inputAuthor').value;
        const yearBook = document.getElementById('inputYear').value;
        const isCompleteBook = document.getElementById('inputBookIsComplete').checked;

        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, isCompleteBook);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId() {
        return +new Date();
    }

    function generateBookObject(id, title, author, year, isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete
        }
    }

    document.addEventListener(RENDER_EVENT, function () {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        incompleteBookshelfList.innerHTML = '';

        const completeBookshelfList = document.getElementById('completeBookshelfList');
        completeBookshelfList.innerHTML = '';

        for (const bookItem of books) {
            const bookElement = makeListBook(bookItem);
            if (!bookItem.isComplete) {
                incompleteBookshelfList.append(bookElement);
            } else {
                completeBookshelfList.append(bookElement)
            }
        }
    });

    function makeListBook(bookObject) {
        const textTitle = document.createElement('h3');
        textTitle.innerText = bookObject.title;

        const textAuthor = document.createElement('p');
        textAuthor.innerText = bookObject.author;

        const textYear = document.createElement('p');
        textYear.innerText = bookObject.year;

        const textContainer = document.createElement('div');
        textContainer.classList.add('bookInner');
        textContainer.append(textTitle, textAuthor, textYear);

        const container = document.createElement('article');
        container.classList.add('book_item');
        container.append(textContainer);
        container.setAttribute('id', `book-${bookObject.id}`);

        if (bookObject.isComplete) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');

            undoButton.addEventListener('click', function () {
                undoBookFromComplete(bookObject.id);
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');

            deleteButton.addEventListener('click', function () {
                removeBookFromComplete(bookObject.id);
            });

            const actionButton = document.createElement('div');
            actionButton.classList.add('action');
            actionButton.append(undoButton, deleteButton)

            container.append(actionButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');

            checkButton.addEventListener('click', function () {
                addBooktoComplete(bookObject.id);
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');

            deleteButton.addEventListener('click', function () {
                removeBookFromComplete(bookObject.id);
            });

            const actionButton = document.createElement('div');
            actionButton.classList.add('action');
            actionButton.append(checkButton, deleteButton)

            container.append(actionButton);
        }

        return container;
    }

    function addBooktoComplete(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId) {
        for (const bookItem of books) {
            if (bookItem.id === bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function removeBookFromComplete(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget === -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function undoBookFromComplete(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBookIndex(bookId) {
        for (const index in books) {
            if (books[index].id === bookId) {
                return index;
            }
        }

        return -1;
    }

    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser gk ada bisa local storage');
            return false;
        }
        return true;
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const searchBook = document.getElementById('searchBook');

    searchBook.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBookTitle();
    });

    function searchBookTitle() {
        const inputSearchBook = document.getElementById('searchBookTitle').value.toLowerCase();
        const bookTitleList = document.querySelectorAll('.book_item > .bookInner > h3');
        for (const book of bookTitleList) {
            if (book.innerText.toLowerCase().includes(inputSearchBook)) {
                book.parentElement.parentElement.style.display = '';
            } else {
                book.parentElement.parentElement.style.display = 'none';
            }
        }
    }


});