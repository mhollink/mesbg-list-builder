import {useEffect} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {rostersApi} from "~/api/api.ts";

export function RostersPage() {


    useEffect(() => {
        rostersApi.listRosters()
            .then(console.log)
            .catch(console.error);
    })

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Rosters
            </Typography>
        </Box>
    )
}