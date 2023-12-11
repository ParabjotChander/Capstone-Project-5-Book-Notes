/* Retrieve Information From DataBase */

SELECT * FROM books;

/* Creating Book Review */

INSERT INTO books (isbn, api, review, rating, date) VALUES ($1, $2, $3, $4, $5);

/* Updating Book Review */

UPDATE books SET review = $1, rating = $2 WHERE id = $3;

/* Deleting a Book Review*/

DELETE FROM books WHERE id = $1;

/* Sorting Book Reviews by Rating */

SELECT * FROM books ORDER BY rating ASC;

/* Sorting Book Reviews by Recency */

SELECT * FROM books ORDER BY id DESC;