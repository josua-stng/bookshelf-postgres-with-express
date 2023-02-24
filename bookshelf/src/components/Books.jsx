import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBooks from "./SearchBooks";
import Swal from "sweetalert2";

function Books() {
  const [books, setBooks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputValue = (e) => {
    setInputValue(e.target.value);
  };

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

  const alertButtonDanger = (bookId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this book?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<span class="text-white">Yes, delete it!</span>',
      cancelButtonText: '<span class="text-white">No, cancel!</span>',
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "px-4 ml-4 py-2 bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50",
        cancelButton:
          "px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooks(bookId);
        Swal.fire("Deleted!", "Your book has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your books is safe :)", "error");
      }
    });
  };
  useEffect(() => {
    bookList();
  }, []);

  return (
    <div className="App">
      <div className="bg-red-200 mx-auto text-center mt-20 p-10 w-[90%] mb-10">
        <h2 className="text-3xl font-bold">Book List</h2>
        <div className="flex justify-center mt-3 mb-2  ">
          <SearchBooks onChange={handleInputValue} />
          <Link
            to="/books/add "
            className="bg-gray-200 w-[120px] h-[50px] flex flex-col justify-center text-sm hover:bg-gray-300"
          >
            Add Books
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 lg:grid-cols-3">
          {books
            .filter((book) => {
              if (inputValue === "") {
                return book;
              } else if (
                book.name.toLowerCase().includes(inputValue.toLowerCase())
              ) {
                return book;
              }
              return null;
            })
            .map((book) => {
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
                        <button className="bg-gray-300 w-[100px] h-[30px] hover:bg-slate-200">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => alertButtonDanger(book.id)}
                        className="bg-gray-300 w-[100px] h-[30px] hover:bg-gray-200"
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
