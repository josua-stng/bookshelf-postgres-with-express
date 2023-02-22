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

// CORS handling with Middleware
app.use((req,res,next)=>{ 
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS"); // <-- tambahkan OPTIONS
  res.header("Access-Control-Allow-Headers","Content-Type");
  next();
})


// option for CROS DELETE and PUT HTTP request
app.options('/books/:id', (req, res) => {
  res.header("Access-Control-Allow-Methods", "DELETE","PUT"); // 
  res.send();
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
    console.log(result.rows);
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
    else if(result.rows.length === 0){
      res.send({
        status:501,
        message:'Id not found'
      })
      return;
    }
    // kirimkan data hasil query dalam format JSON
    return res.status(200).json(result.rows);
  });
});

// create a new books
app.post("/books/add", (req, res) => {
  const { name, year, author, summary } = req.body;
  if(isNaN(year)){
  return res.status(401).send({
    message:'year must be number'
  })
  }
  pool.query(
    `INSERT INTO books (name,year,author,summary) VALUES ($1,$2,$3,$4)`,
    [name, year, author, summary],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send(`Internal server error`);
        return;
      }
      return res.send({
        status:201,
        message:'Book added successfuly'
      })
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
              else if(result.rowCount === 0){
                return res.send({
                  status:500,
                  message:'Failed delete, Id not found'
                })
              }
              return res.status(201).send(`Book successfuly deleted`);
        }
    )
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

