import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import DebugProfile from "~/features/admin-data-checker/DebugProfile.tsx";
import { useCheckedProfiles } from "~/features/admin-data-checker/useCheckedProfiles.ts";
import { useGameProfiles } from "~/features/reference/profiles/hooks/useGameProfiles.ts";
import type {
  LocalizedProfile,
  Source,
} from "~/features/reference/profiles/profiles.types.ts";
import { useGameRules } from "~/features/reference/rules/hooks/useGameRules.ts";
import type { Rule } from "~/features/reference/rules/rules.types.ts";

export function DebugProfiles() {
  const { profiles } = useGameProfiles();
  const { rules } = useGameRules();
  const { t } = useTranslation("game-data");

  const { isChecked, setChecked } = useCheckedProfiles();

  const sortedProfiles = useMemo(
    () => [...profiles].sort(byProfileSource),
    [profiles],
  );

  const rulesById = useMemo(
    () => new Map<string, Rule>(rules.map((rule) => [rule.id, rule])),
    [rules],
  );

  const profilesByBook = useMemo(() => {
    const books = new Map<string, LocalizedProfile[]>();

    for (const profile of sortedProfiles) {
      const bookProfiles = books.get(profile.source.book) ?? [];
      bookProfiles.push(profile);
      books.set(profile.source.book, bookProfiles);
    }

    return [...books.entries()];
  }, [sortedProfiles]);

  return (
    <Box
      sx={{
        minWidth: 1200,
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
        gap: 3,
        p: 3,
      }}
    >
      <Paper
        component="nav"
        variant="outlined"
        sx={{
          position: "sticky",
          top: 16,
          alignSelf: "start",
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
          p: 2,
        }}
      >
        <Typography variant="h6">Profiles</Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {profiles.length} profiles in {profilesByBook.length} books
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <Stack>
          {profilesByBook.map(([book, bookProfiles]) => (
            <Link
              key={book}
              href={`#book-${book}`}
              underline="hover"
              color="text.primary"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                py: 0.75,
              }}
            >
              <span>{t(`books.${book}`)}</span>

              <Typography
                component="span"
                variant="body2"
                color="textSecondary"
              >
                {bookProfiles.length}
              </Typography>
            </Link>
          ))}
        </Stack>
      </Paper>

      <Stack spacing={4}>
        {profilesByBook.map(([book, bookProfiles]) => {
          const checkedCount = bookProfiles.filter((profile) =>
            isChecked(profile.profile),
          ).length;
          const checkedPercent = (checkedCount / bookProfiles.length) * 100;
          return (
            <Box
              key={book}
              component="section"
              id={`book-${book}`}
              sx={{ scrollMarginTop: 64 }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 64,
                  zIndex: 2,
                  bgcolor: "background.default",
                  borderBottom: 1,
                  borderColor: "divider",
                  py: 1.5,
                  mb: 2,
                }}
              >
                <Typography variant="h4">{t(`books.${book}`)}</Typography>

                <Typography variant="body2" color="textSecondary">
                  {checkedCount} / {bookProfiles.length} profiles
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={checkedPercent}
                  sx={{ mt: 1 }}
                  color={
                    checkedPercent > 0.33
                      ? "error"
                      : checkedCount > 0.75
                        ? "warning"
                        : "success"
                  }
                />
              </Box>

              <Stack spacing={2}>
                {bookProfiles.map((profile) => (
                  <DebugProfile
                    key={profile.profile}
                    profile={profile}
                    rules={rulesById}
                    checked={isChecked(profile.profile)}
                    onCheckedChange={setChecked}
                  />
                ))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

function byProfileSource(a: LocalizedProfile, b: LocalizedProfile) {
  return bySource(a.source, b.source) || a.name.localeCompare(b.name);
}

function bySource(a: Source, b: Source) {
  const bookOrder = a.book.localeCompare(b.book);

  if (bookOrder !== 0) {
    return bookOrder;
  }

  return a.page - b.page;
}
