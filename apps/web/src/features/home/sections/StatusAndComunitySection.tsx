import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Grid,
	Stack,
	Typography,
} from "@mui/material";
import { PreviewRow } from "../components/PreviewRow.tsx";

export function StatusAndCommunitySection() {
	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12, md: 6 }}>
				<Card variant="outlined" sx={{ height: "100%" }}>
					<CardContent>
						<Stack spacing={2}>
							<Chip label="Data status" sx={{ alignSelf: "flex-start" }} />
							<Typography variant="h5" sx={{ fontWeight: 800 }}>
								MESBG 2024 data
							</Typography>
							<Typography color="text.secondary">
								The builder is only useful when the data is reliable. Check the
								current edition status, review known issues, and report anything
								that looks incorrect.
							</Typography>

							<Stack spacing={1}>
								<PreviewRow label="Edition" value="2024" />
								<PreviewRow label="Last data update" value={BUILD_DATE} />
								<PreviewRow label="App version" value={BUILD_VERSION} />
								<PreviewRow
									label="Known issues"
									value="View list"
									linkTo="https://github.com/mhollink/mesbg-list-builder/issues"
									success
								/>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Grid>

			<Grid size={{ xs: 12, md: 6 }}>
				<Card variant="outlined" sx={{ height: "100%" }}>
					<CardContent>
						<Stack spacing={2}>
							<Stack
								direction="row"
								spacing={1}
								useFlexGap
								sx={{ flexWrap: "wrap" }}
							>
								<Chip
									icon={<BugReportOutlinedIcon />}
									label="Report issues"
									variant="outlined"
								/>
								<Chip
									icon={<PhoneIphoneOutlinedIcon />}
									label="Installable app"
									variant="outlined"
								/>
							</Stack>

							<Typography variant="h5" sx={{ fontWeight: 800 }}>
								Help improve the List Builder
							</Typography>

							<Typography color="text.secondary">
								The List Builder improves through player feedback. Share missing
								options, data mistakes or ideas that would make the tool better
								at the table.
							</Typography>
						</Stack>
					</CardContent>

					<CardActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: "wrap" }}>
						<Button href="/feedback" variant="contained">
							Report issue
						</Button>
						<Button href="/support" variant="outlined">
							Support development
						</Button>
					</CardActions>
				</Card>
			</Grid>

			<Grid size={{ xs: 12 }} sx={{ placeItems: "center" }}>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ textAlign: "center", maxWidth: "100ch" }}
				>
					MESBG List Builder is an unofficial fan-made utility for the
					Middle-earth Strategy Battle Game. It is not affiliated with or
					endorsed by Games Workshop, Middle-earth Enterprises or their
					partners.
				</Typography>
			</Grid>
		</Grid>
	);
}
