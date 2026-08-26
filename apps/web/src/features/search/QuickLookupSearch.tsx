import {type SubmitEvent, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {Search} from "./Search.tsx";
import {SearchIconWrapper} from "./SearchIconWrapper.tsx";
import {StyledInputBase} from "./StyledInputBase.tsx";


interface QuickLookupSearchProps {
    onSearch: (query: string) => void;
}

export const QuickLookupSearch = ({
                                      onSearch,
                                  }: QuickLookupSearchProps) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return;
        }

        onSearch(trimmedQuery);
    };

    return (
        <Search onSubmit={handleSubmit}>
            <SearchIconWrapper>
                <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Quick lookup…"
                inputProps={{'aria-label': 'search'}}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                slotProps={{
                    input: {
                        "aria-label": "Quick lookup rules and profiles",
                    }
                }}
            />
        </Search>
    );
};