import {type SubmitEvent, useState } from "react";
import {
    Box,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

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
        <Box
            component="form"
            role="search"
            onSubmit={handleSubmit}
            sx={{
                width: {
                    sm: 280,
                    md: 360,
                },
            }}
        >
            <TextField
                fullWidth
                size="small"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Quick lookup..."
                slotProps={{
                    htmlInput: {
                        "aria-label": "Quick lookup rules and profiles",
                    },
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    type="submit"
                                    edge="end"
                                    aria-label="Search"
                                    disabled={!query.trim()}
                                >
                                    <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};