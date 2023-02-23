import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditBooks = () => {
  const [nameUrl, setNameUrl] = useState("");
  const [summaryUrl, setSummaryUrl] = useState("");
  const [yearUrl, setYearUrl] = useState("");
  const [authorUrl, setAuthorUrl] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const editBooks = async (e) => {
    e.preventDefault();
    try {
      const yearToString = parseInt(yearUrl);
      if (isNaN(yearUrl)) {
        alert("Year must be number");
      } else {
        const body = {
          name: nameUrl,
          summary: summaryUrl,
          year: yearToString,
          author: authorUrl,
        };
        const response = await fetch(`http://localhost:3000/books/${id}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          navigate("/");
        } else {
          const error = await response.json();
          throw new Error(error.error);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditBooks = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`);
      const data = await response.json();
      const result = data[0];
      setNameUrl(result.name);
      setSummaryUrl(result.summary);
      setYearUrl(result.year);
      setAuthorUrl(result.author);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    handleEditBooks(id);
  }, [id]);

  return (
    <div>
      <div className="mt-5">
        <Link to="/" className="">
          <button className=" ml-5 bg-gray-200 border-2 w-[100px] h-[40px] rounded-lg border-black">
            Back
          </button>
        </Link>
      </div>
      <h1 className="text-center mt-10 mb-5 text-2xl font-bold">Edit Books</h1>
      {error && <div className="error-msg">{error}</div>}
      <form
        action=""
        className="flex flex-col justify-center text-center items-center leading-[50px]"
        onSubmit={editBooks}
      >
        <input
          type="text"
          placeholder="enter name books"
          value={nameUrl}
          onChange={(e) => setNameUrl(e.target.value)}
          className="border-2 border-black mb-10 pl-2"
        />
        <input
          type="text"
          placeholder="enter summary books"
          value={summaryUrl}
          onChange={(e) => setSummaryUrl(e.target.value)}
          className="border-2 border-black mb-10 pl-2"
        />
        <input
          type="text"
          placeholder="enter year books"
          value={yearUrl}
          onChange={(e) => setYearUrl(e.target.value)}
          className="border-2 border-black mb-10 pl-2"
        />
        <input
          type="text"
          placeholder="enter author books"
          value={authorUrl}
          onChange={(e) => setAuthorUrl(e.target.value)}
          className="border-2 border-black mb-10 pl-2"
        />
        <button className="bg-gray-200 w-[270px]">Submit</button>
      </form>
    </div>
  );
};

export default EditBooks;
