import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);

  const bookList = async () => {
    const data = await fetch("http://localhost:3000/books");
    const response = await data.json();
    setBooks(response);
  };

  const deleteBooks = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: "DELETE",
      });
      if (response.status >= 4001) {
        console.error(error);
        return;
      }
      setBooks((book) => book.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    bookList();
  }, []);

  return (
    <div className="App">
      <div className="bg-red-200 mx-auto text-center mt-20 p-10 w-[90%] mb-10">
        <h2 className="text-3xl font-bold">Book List</h2>
        <div className="flex justify-center mt-3 mb-2  ">
          <input
            className="w-full max-w-[180px] mr-5 rounded-lg pl-2"
            type="text"
            placeholder="search books"
          />
          <Link
            to="/books/add "
            className="bg-gray-200 w-[120px] h-[50px] flex flex-col justify-center text-sm"
          >
            Add Books
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 lg:grid-cols-3">
          {books.map((book) => {
            return (
              <div key={book.id} className="mt-5 flex flex-col ">
                <div className="bg-cyan-200 h-[230px] p-2">
                  <p className="font-bold p-5 lg:text-2xl">{book.name}</p>
                  <p className="lg:text-base">Summary : {book.summary}</p>
                  <div className="flex justify-evenly pt-5 pb-5">
                    <p>Year : {book.year}</p>
                    <p>Author : {book.author}</p>
                  </div>
                  <div className="flex justify-around mt-2">
                    <Link to={`/books/${book.id}`}>
                      <button className="bg-gray-300 w-[100px] h-[30px]">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteBooks(book.id)}
                      className="bg-gray-300 w-[100px] h-[30px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Books;
