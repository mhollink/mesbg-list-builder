import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link as RouterLink } from "react-router";
import { PolicyDocument } from "./components/PolicyDocument";
import { PolicySection } from "./components/PolicySection";

const CONTACT_EMAIL = "support@mesbg-list-builder.com";
const LAST_UPDATED = "July 2026";

export function PoliciesPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            py: {
              xs: 8,
              md: 11,
            },
          }}
        >
          <Stack
            spacing={3}
            sx={{
              maxWidth: 840,
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Clear policies for a free and sustainable list builder
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 740,
                fontSize: {
                  xs: "1.05rem",
                  md: "1.2rem",
                },
                lineHeight: 1.7,
              }}
            >
              These policies explain what information is stored, how it is used,
              and how we keep the service available for the entire community.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <Button
                component="a"
                href="#privacy"
                variant="contained"
                size="large"
              >
                Read privacy policy
              </Button>

              <Button
                component="a"
                href="#fair-use"
                variant="outlined"
                size="large"
              >
                Read fair use policy
              </Button>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                pt: 1,
              }}
            >
              Last updated: {LAST_UPDATED}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 5,
            md: 8,
          },
        }}
      >
        <Stack spacing={5}>
          <PolicyDocument
            eyebrow="Your data"
            title="Privacy Policy"
            introduction="We only collect and process information that is needed to provide, secure, maintain, and improve the list builder. This policy explains what information may be stored and how it is used."
          >
            <PolicySection
              id="privacy"
              title="Information we store"
              description="The information associated with your account may include:"
              items={[
                "Your account identifier, email address, display name, and profile image when these are provided by your authentication provider.",
                "Rosters, roster groups, collections, match history, ongoing games, tags, notes, and other content you choose to create.",
                "Account creation, login, and synchronisation information needed to operate your account.",
                "Technical information such as request timestamps, application errors, browser information, IP addresses, and security logs.",
              ]}
            />

            <PolicySection
              title="How we use your information"
              items={[
                "To create, authenticate, and manage your account.",
                "To store and synchronise your rosters and other user-created content.",
                "To restore your information when you sign in on another device.",
                "To provide support and investigate technical problems.",
                "To protect the application and its users against misuse, fraud, and unauthorised access.",
                "To understand application reliability and improve the service using aggregated or anonymised information.",
              ]}
            />

            <PolicySection
              title="User-created content"
              description="You decide which information you enter into the application. Roster names, tags, notes, opponent names, and similar fields should not be used to store sensitive personal information."
            />

            <PolicySection
              title="Sharing information"
              description="We do not sell your personal information or use the contents of your private rosters for advertising. Information may be processed by trusted service providers where this is necessary to operate the application."
              items={[
                "Authentication providers used to sign users in.",
                "Hosting and database providers used to run the application and store data.",
                "Monitoring, logging, or error-reporting providers used to keep the application reliable and secure.",
                "Email or support providers when you contact the project.",
              ]}
            />

            <PolicySection
              title="Access to private data"
              description="Private roster and account data is not intentionally accessed except when this is necessary for technical maintenance, security investigations, legal obligations, or support requested by the user."
            />

            <PolicySection
              title="Data retention and deletion"
              items={[
                "Account information and user-created content are retained while your account remains active.",
                "When an account is deleted, its associated data will be removed from active systems within a reasonable period.",
                "Deleted data may remain temporarily in encrypted backups until those backups are rotated.",
                "Technical and security logs may be retained for a limited period to investigate incidents and maintain application security.",
                "Some information may be retained longer where this is required by law or necessary to establish, exercise, or defend legal claims.",
              ]}
            />

            <PolicySection
              title="Security"
              description="Reasonable technical and organisational safeguards are used to protect stored information. No online service can guarantee absolute security, but access to production systems and databases is restricted to what is necessary to operate the service."
            />

            <PolicySection
              title="Your rights"
              description="Depending on your location, you may have the right to access, correct, export, restrict, or delete your personal information. You may also have the right to object to certain processing activities."
            >
              <Typography
                color="text.secondary"
                sx={{
                  mt: 2,
                  lineHeight: 1.75,
                }}
              >
                Requests can be sent to{" "}
                <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>.
                We may need to verify that the request relates to your account
                before providing or deleting information.
              </Typography>
            </PolicySection>

            <PolicySection
              title="Changes to this policy"
              description="This policy may be updated when the application, its infrastructure, or its legal obligations change. The most recent version will always be published on this page together with its last-updated date."
            />
          </PolicyDocument>

          <PolicyDocument
            eyebrow="Shared infrastructure"
            title="Fair Use & Sustainability Policy"
            introduction="The list builder is available without a subscription. To keep it fast, reliable, and affordable for everyone, users are expected to use its shared infrastructure responsibly."
          >
            <PolicySection
              id="fair-use"
              title="Normal use is encouraged"
              description="The application is intended to support active players and hobbyists. Normal use includes:"
              items={[
                "Creating and maintaining personal rosters.",
                "Organising armies, collections, groups, and related hobby information.",
                "Recording matches and maintaining a personal match history.",
                "Using the application regularly during games, events, and hobby sessions.",
                "Printing, exporting, or sharing rosters through the features provided by the application.",
                "Keeping a large collection of legitimate rosters that are meaningfully used or maintained.",
              ]}
            />

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.045),
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.24),
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                Frequent use is not automatically excessive use.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                Players should feel comfortable using the application as part of
                their normal hobby. This policy is intended to prevent
                deliberate misuse and disproportionate automated usage, not to
                discourage enthusiastic users.
              </Typography>
            </Paper>

            <PolicySection
              title="Excessive or abusive use"
              description="Usage may be considered excessive or abusive when it unreasonably consumes shared resources, disrupts the service, or uses the application for a purpose it was not designed for."
              items={[
                "Automated creation of accounts, rosters, games, or requests without prior permission.",
                "Scraping, mirroring, or bulk-downloading application data or datasets.",
                "Using the application as general-purpose file, document, or text storage.",
                "Creating excessive duplicate or meaningless content primarily to consume storage.",
                "Circumventing rate limits, storage limits, access controls, or other technical protections.",
                "Creating multiple accounts to avoid restrictions.",
                "Generating traffic that negatively affects application performance or availability.",
                "Attempting to access, alter, or extract another user's private information.",
                "Reselling access to the hosted application or operating a commercial service through it without permission.",
                "Uploading or storing unlawful, harmful, or malicious content.",
              ]}
            />

            <PolicySection
              title="Reasonable limits"
              description="Technical limits may be introduced when needed to protect application stability and control operating costs. These limits may apply to storage, request frequency, exports, automated access, or other resource-intensive features."
            />

            <PolicySection
              title="How we respond to unusual usage"
              items={[
                "We may contact users to understand unusual activity or unusually high resource usage.",
                "We may ask users to reduce, archive, export, or remove unnecessary data.",
                "Automated or excessive traffic may be rate-limited or temporarily blocked.",
                "Accounts may be temporarily restricted when their activity threatens security or availability.",
                "Serious, malicious, or repeated violations may result in account suspension or deletion.",
              ]}
            />

            <PolicySection
              title="Communication before restriction"
              description="Where practical, we will contact the affected user before restricting an account. Immediate action may be taken when necessary to protect user data, application security, infrastructure stability, or other users."
            />

            <PolicySection
              title="Supporting the project"
              description="Hosting, databases, backups, monitoring, development, and maintenance all have ongoing costs. Users who store unusually large amounts of data or use the application extensively are encouraged to support the project financially when they are able to do so."
            />

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.045),
                borderColor: (theme) =>
                  alpha(theme.palette.secondary.main, 0.24),
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                Financial support is voluntary.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                Supporting the project does not purchase unlimited storage,
                unlimited automated access, or an exemption from this policy.
                Contributions help keep the application available to the wider
                community.
              </Typography>

              <Button
                component={RouterLink}
                to="/support"
                variant="outlined"
                sx={{
                  mt: 2.5,
                }}
              >
                Support the project
              </Button>
            </Paper>

            <PolicySection
              title="Changes to this policy"
              description="This policy may change as the application grows and its infrastructure requirements evolve. Material changes will be published on this page."
            />
          </PolicyDocument>

          <Paper
            variant="outlined"
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },
              borderRadius: 4,
              textAlign: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.035),
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              Questions about these policies?
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mx: "auto",
                maxWidth: 640,
                lineHeight: 1.7,
              }}
            >
              Contact the project when something is unclear, when you want to
              request access to your data, or when you believe your account has
              been affected incorrectly.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{
                mt: 3,
                justifyContent: "center",
              }}
            >
              <Button
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                variant="contained"
              >
                Contact us
              </Button>

              <Button component={RouterLink} to="/" variant="text">
                Return to homepage
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
