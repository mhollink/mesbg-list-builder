import { Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { PageSection } from "../components/PageSection.tsx";

const workflow = [
	"Choose an army",
	"Build your roster",
	"Use it at the table",
	"Record the result",
];

export function HowItWorksSection() {
	return (
		<PageSection
			eyebrow="Flow"
			title="How it works"
			description="Create an account once, then build rosters, use them at the table and keep your results and collection data together over time."
		>
			<Grid container spacing={2}>
				{workflow.map((step, index) => (
					<Grid key={step} size={{ xs: 12, sm: 6, md: 3 }}>
						<Paper variant="outlined" sx={{ p: 2.5 }}>
							<Stack spacing={1}>
								<Chip label={index + 1} sx={{ alignSelf: "flex-start" }} />
								<Typography variant="h6" sx={{ fontWeight: 800 }}>
									{step}
								</Typography>
							</Stack>
						</Paper>
					</Grid>
				))}
			</Grid>
		</PageSection>
	);
}
