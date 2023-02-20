import express from "express";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const PORT = 3000;

app.use(express.json());

// Check HTTP Method Request
app.use((req, res, next) => {
  console.log(`/${req.method}`);
  next();
});

// buat koneksi ke database
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false }
});

// get all books
app.get("/books", (req, res) => {
  pool.query(`SELECT * FROM books`, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
    // kirimkan data hasil query dalam format JSON
    return res.status(200).json(result.rows);
  });
});

// get detail books
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  pool.query(`SELECT * FROM books WHERE id=${id}`, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
    // kirimkan data hasil query dalam format JSON
    return res.status(200).json(result.rows);
  });
});

// create a new books
app.post("/books/add", (req, res) => {
  const { name, year, author, summary } = req.body;
  pool.query(
    `INSERT INTO books (name,year,author,summary) VALUES ($1,$2,$3,$4)`,
    [name, year, author, summary],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send(`Internal server error`);
        return;
      }
      return res.status(201).send(`Book added successfuly`);
    }
  );
});

// update value table
app.put('/books/:id',(req,res)=>{
    const {id}= req.params;
    const {name,year,author,summary} =req.body;
    pool.query(
        `UPDATE books SET name=$1,year=$2,author=$3,summary=$4 WHERE id=${id}`,[name,year,author,summary],
        (error,result)=>{
            if (error) {
                console.error(error);
                res.status(500).send(`Internal server error`);
                return;
              }
              return res.status(201).send(`Book successfuly updated`);
        }
    )
})

// Delete value table
app.delete('/books/:id',(req,res)=>{
    const {id} = req.params;
    pool.query(
        `DELETE FROM books where id=${id}`,
        (error,result)=>{
            if (error) {
                console.error(error);
                res.status(500).send(`Internal server error`);
                return;
              }
              return res.status(201).send(`Book successfuly deleted`);
        }
    )
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

