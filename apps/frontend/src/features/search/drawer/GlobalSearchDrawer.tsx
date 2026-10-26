import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SearchField } from "../components/SearchField.tsx";
import { SearchResults } from "../components/SearchResults.tsx";
import { SEARCH_PREVIEW_LIMIT } from "../domain/search.constants.ts";
import { useSearchNavigation } from "../hooks/useSearchNavigation.ts";
import { useSearchResults } from "../hooks/useSearchResults.ts";
import { useDrawerScrollRestoration } from "~/features/drawer-stack/hooks/useDrawerScrollRestoration.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

interface Props {
  scrollPositions: Map<string, number>;
}
export function GlobalSearchDrawer({ scrollPositions }: Props) {
  const { t } = useTranslation("search");
  const [params] = useSearchParams();
  const { activeDrawer, closeDrawer, openSearchDrawer } = useDrawerStack();
  const open = activeDrawer?.type === "search";
  const query =
    open || params.getAll("drawer").includes("search")
      ? (params.get("lookup") ?? "")
      : "";
  const search = useSearchResults(query, SEARCH_PREVIEW_LIMIT);
  const { openResult, openSearchPage } = useSearchNavigation();
  const { paperRef, onScroll, onEnter, onEntered } = useDrawerScrollRestoration(
    open,
    scrollPositions,
  );
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeDrawer}
      slotProps={{
        paper: {
          ref: paperRef,
          onScroll,
          sx: { width: { xs: "100%", sm: 620, md: 760 }, maxWidth: "100%" },
        },
        transition: { onEnter, onEntered },
      }}
    >
      <Stack sx={{ minHeight: "100%" }}>
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 2,
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            sx={{
              mb: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5">{t("title")}</Typography>
            <IconButton onClick={closeDrawer} aria-label={t("close")}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <SearchField query={query} onSubmit={openSearchDrawer} />
        </Box>
        <Box sx={{ flex: 1, px: { xs: 2, sm: 3 }, py: 2 }}>
          {query && (
            <SearchResults
              search={search}
              mode="preview"
              onOpen={openResult}
              onViewAll={(category) => openSearchPage(query, category)}
            />
          )}
        </Box>
        <Divider />
        <Box sx={{ p: 2, textAlign: "right" }}>
          <Button
            onClick={() => openSearchPage(query)}
            disabled={!query.trim()}
          >
            {t("viewAll")}
          </Button>
        </Box>
      </Stack>
    </Drawer>
  );
}
