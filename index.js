// Node Modules 
import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";

// Creating Express App
const app = express();
const port = 3000;

// Database Setup
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "***********",
  port: 5432,
});

db.connect();

// MiddleWare
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let books = [];

// Read for HTTP GET Request 
app.get("/", async (req, res) => {
  
  const result = await db.query("SELECT * FROM books");
  books = result.rows;
  res.render("index.ejs", { book_reviews: books } );

});

// creating book review 
app.post("/submit", async (req, res) => {

   try {
      
      const isbn = req.body.isbn;
      const review = req.body.review;
      const rating = req.body.rating;
      const date = new Date().toString();
      const api_link = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
      
      await db.query("INSERT INTO books (isbn, api, review, rating, date) VALUES ($1, $2, $3, $4, $5);", [isbn, api_link, review, rating, date]);
      
      res.redirect("/");
   
   }catch(error) {
      console.log("There was an error when attempting to submit book review");
   }

});

// updating a book review

app.post("/edit", async (req, res) => {

  try {
    
    const id = req.body.updatedReviewId;
    const review = req.body.updatedReview;
    const rating = req.body.updatedRating;

    await db.query("UPDATE books SET review = $1, rating = $2 WHERE id = $3;", [review, rating, id]); 
  
    res.redirect("/");
  }catch(error) {
    console.log(error + " Couldn't edit book review");
  }

});


// deleting a book review

app.post("/delete", async (req, res) => {

  try {
    
    const id = req.body.deleteReviewId;

    await db.query("DELETE FROM books WHERE id = $1", [id]);
    
    res.redirect("/");
  
  }catch(error) {
    console.log(error + " Couldn't delete book review");
  }

});

//Sorting Book Reviews by Rating

app.post("/sortByRating", async (req, res) => {
  
  const result = await db.query("SELECT * FROM books ORDER BY rating ASC;");
  
  books = result.rows;
  
  res.render("index.ejs", { book_reviews: books } );
});

//Sorting Book Reviews by Recency

app.post("/sortByRecency", async (req, res) => {
  
  const result = await db.query("SELECT * FROM books ORDER BY id DESC;");
  
  books = result.rows;
  
  res.render("index.ejs", { book_reviews: books } );
});

// Express App Listening on port 3000
app.listen(port, () =>{
  console.log(`Server running on https://localhost/${port}`);
});