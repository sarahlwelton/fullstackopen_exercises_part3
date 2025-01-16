const Filter = ({handleFilterChange}) => {

    return (
        <div>
            search for <input 
            onChange={handleFilterChange}/>
        </div>
    )
}

export default Filter