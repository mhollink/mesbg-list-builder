import Box from "@mui/material/Box";

import heraldry from "~/generated/assets/heraldry-map.json";
import heraldrySprite from "~/generated/assets/heraldry.webp";

export type HeraldryIconName = keyof typeof heraldry.icons;

interface HeraldryIconProps {
    name: HeraldryIconName;
    size?: number;
}

export function HeraldryIcon({
                                 name,
                                 size = 48,
                             }: HeraldryIconProps) {
    const [x, y] = heraldry.icons[name];
    const scale = size / heraldry.cellSize;

    return (
        <Box
            component="span"
            aria-hidden="true"
            sx={{
                display: "inline-block",
                width: size,
                height: size,
                flexShrink: 0,
                backgroundImage: `url(${heraldrySprite})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${heraldry.width * scale}px ${heraldry.height * scale}px`,
                backgroundPosition: `${-x * scale}px ${-y * scale}px`,
                filter: (theme) =>
                    theme.palette.mode === "dark"
                        ? "brightness(0) invert(1) opacity(66%);"
                        : "opacity(66%);",
            }}
        />
    );
}