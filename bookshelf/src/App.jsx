import { Route, Routes } from "react-router-dom"
import AddBooks from "./components/AddBooks"
import Books from "./components/Books"
import EditBooks from "./components/EditBooks"

const App =()=>{
  return(
    <div>
      <Routes>
        <Route path="/" element={<Books/>}/>
        <Route path="/books/add" element={<AddBooks/>}/>
        <Route path="/books/:id" element={<EditBooks/>}/>
        <Route/>
      </Routes>
    </div>
  )
}
export default App