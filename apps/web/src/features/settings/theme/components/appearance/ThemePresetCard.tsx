import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type {ThemePreset} from "../../theme.types.ts";


interface ThemePresetCardProps {
    preset: ThemePreset;
    selected: boolean;
    onSelect: () => void;
}

export function ThemePresetCard({
                             preset,
                             selected,
                             onSelect,
                         }: ThemePresetCardProps) {
    return (
        <Card
            variant="outlined"
            sx={{
                borderWidth: selected ? 2 : 1,
                borderColor: selected
                    ? "primary.main"
                    : "divider",
            }}
        >
            <CardActionArea
                onClick={onSelect}
                sx={{
                    height: "100%",
                    p: 2,
                }}
            >
                <Stack spacing={2}>
                    <Box>
                        <Typography sx={{fontWeight: 600}}>
                            {preset.name}
                        </Typography>

                        {preset.description && (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {preset.description}
                            </Typography>
                        )}
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <ColorPreview color={preset.colors.brand.primary}/>
                        <ColorPreview color={preset.colors.brand.secondary}/>
                        <ColorPreview color={preset.colors.brand.accent}/>
                    </Stack>
                </Stack>
            </CardActionArea>
        </Card>
    );
}

function ColorPreview({
                          color,
                      }: {
    color: string;
}) {
    return (
        <Box
            sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: color,
                border: 1,
                borderColor: "divider",
            }}
        />
    );
}