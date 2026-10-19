import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export function CrownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M2 8l5 4 5-7 5 7 5-4-2 11H4L2 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export default CrownIcon;
