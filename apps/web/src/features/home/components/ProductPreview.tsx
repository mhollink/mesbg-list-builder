import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

export function ProductPreview({
	title,
	subtitle,
	lines,
}: {
	title: string;
	subtitle: string;
	lines: string[];
}) {
	return (
		<Paper
			variant="outlined"
			sx={(theme) => ({
				p: 2,
				height: "100%",
				minHeight: 250,
				background: `linear-gradient(180deg, ${alpha(
					theme.palette.primary.main,
					0.08,
				)}, transparent 46%)`,
			})}
		>
			<Stack spacing={2} sx={{ height: "100%" }}>
				<Box>
					<Typography variant="h5" sx={{ fontWeight: 900 }}>
						{title}
					</Typography>
					<Typography color="text.secondary" sx={{ mt: 0.5 }}>
						{subtitle}
					</Typography>
				</Box>

				<Box
					sx={(theme) => ({
						flex: 1,
						p: 2,
						border: 1,
						borderColor: "divider",
						backgroundColor: alpha(theme.palette.background.paper, 0.72),
					})}
				>
					<Stack spacing={1}>
						{lines.map((line) => (
							<Stack
								key={line}
								direction="row"
								spacing={2}
								sx={{
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Typography>{line}</Typography>
								<Box
									sx={{
										width: 100,
										height: 8,
										borderRadius: 999,
										bgcolor: "action.selected",
									}}
								/>
							</Stack>
						))}
					</Stack>
				</Box>
			</Stack>
		</Paper>
	);
}
