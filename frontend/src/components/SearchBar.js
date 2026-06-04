import { useEffect, useState, useRef } from "react";
import useDebounce from "../hooks/useDebounce";
import searchContent from "../services/searchService";
import SearchDropdown from "./SearchDropdown"; 
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

function SearchBar(){
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown,setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(searchTerm,500);

    const handleResultClick = (result) => {
        if(result.type === "destination"){
             console.log("Clicked Result:", result);
        }
        else if (result.type === "package") {
            console.log("Package clicked");
        }
        else if (result.type === "story") {
            console.log("Story clicked:", result);
        }
        setShowDropdown(false)
        setSearchTerm("");
    }

    useEffect(() => {
        function handleOutsideClick(event) {
            if ( searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener( "mousedown", handleOutsideClick );
        return () => {
            document.removeEventListener( "mousedown", handleOutsideClick );
        };
    }, []);

    useEffect(() => {
        async function fetchResults(){
            if(!debouncedSearch.trim()){
                setResults([]);
                setShowDropdown(false);
                return;
            }
            setLoading(true);
            setShowDropdown(true);
            const response = await searchContent(debouncedSearch );

            setResults(response?.data || []);
            setLoading(false);
        }

        fetchResults();
    }, [debouncedSearch]);

    return (

        <div className="search-container" ref={searchRef}>

            <FiSearch
                size={18}
                className="search-icon"
            />

            <input
                type="text"
                placeholder =  "Search destinations..."
                value={searchTerm}
                onChange={(event)=>{ setSearchTerm( event.target.value ); }}
                className="search-input"
            />
            {
                showDropdown && (
                    <div className="dropdown-wrapper">
                        <SearchDropdown
                            results={results}
                            loading={loading}
                            // onResultClick={ (item)=>{ console.log(item); }}
                            onResultClick={handleResultClick}
                        />
                    </div>
                )
            }

        </div>
    );
}

export default SearchBar;