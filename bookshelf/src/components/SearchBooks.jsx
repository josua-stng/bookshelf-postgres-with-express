const SearchBooks= ({onChange}) =>{
    return(
        <>
            <input
            className="w-full max-w-[180px] mr-5 rounded-lg pl-2"
            type="text"
            placeholder="search books"
            onChange={onChange}
          />
        </>
    )
}
export default SearchBooks