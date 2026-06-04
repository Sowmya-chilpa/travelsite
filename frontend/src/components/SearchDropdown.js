import "./SearchDropdown.css";

function SearchDropdown({ results,loading,onResultClick}){
    if (loading) {
        return (
            <div className="search-dropdown">
                <p>Searching...</p>
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className="search-dropdown">
                <p>No results found</p>
            </div>
        );
    }

    return (
        <div className="search-dropdown">
            {
                results.map((item) => (
                    <div
                        key={ `${item.type}-${item.slug || item.title}` }
                        className="search-item"
                        onClick={() => onResultClick(item) }
                    >
                        <h4>{item.title} </h4>
                        <p>{item.description}</p>
                    </div>
               ))
            }

        </div>

    );

}

export default SearchDropdown;