import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Chip,
  Paper,
  InputAdornment,
  TextField,
  Avatar,
  Skeleton,
  alpha,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import SportsIcon from "@mui/icons-material/Sports";
import SearchIcon from "@mui/icons-material/Search";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CasinoIcon from "@mui/icons-material/Casino";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InboxIcon from "@mui/icons-material/Inbox";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { toaster } from "../components/Toaster";

const types = ["All", "Snooker", "Football", "Badminton"];

const sportMeta = {
  Snooker: {
    Icon: CasinoIcon,
    color: "#6366f1",
    bg: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  Football: {
    Icon: SportsSoccerIcon,
    color: "#16a34a",
    bg: "linear-gradient(135deg,#16a34a,#22c55e)",
  },
  Badminton: {
    Icon: SportsTennisIcon,
    color: "#d97706",
    bg: "linear-gradient(135deg,#d97706,#f59e0b)",
  },
};

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(46,125,50,0.15)" : "#e8f5e9",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          lineHeight={1.2}
          display="block"
        >
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600} lineHeight={1.4}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function FacilityCardSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Skeleton
          variant="rounded"
          width={48}
          height={48}
          sx={{ borderRadius: 2 }}
        />
        <Box flex={1}>
          <Skeleton width="60%" height={22} />
          <Skeleton width="35%" height={18} sx={{ mt: 0.5 }} />
        </Box>
        <Skeleton
          variant="rounded"
          width={64}
          height={24}
          sx={{ borderRadius: 1 }}
        />
      </Stack>
      <Skeleton height={1} sx={{ mb: 2 }} />
      <Stack spacing={1.5}>
        <Skeleton height={36} sx={{ borderRadius: 1 }} />
        <Skeleton height={36} sx={{ borderRadius: 1 }} />
        <Skeleton height={36} sx={{ borderRadius: 1 }} />
      </Stack>
    </Paper>
  );
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get("type") || "All";

  useEffect(() => {
    setLoading(true);
    const params = activeType !== "All" ? { type: activeType } : {};
    api
      .get("/facilities", { params })
      .then((res) => setFacilities(res.data.facilities))
      .catch(() => {
        setFacilities([]);
        toaster.create({ title: "Failed to load facilities", type: "error" });
      })
      .finally(() => setLoading(false));
  }, [activeType]);

  const handleFilter = (type) => {
    setSearch("");
    if (type === "All") setSearchParams({});
    else setSearchParams({ type });
  };

  const filtered = search.trim()
    ? facilities.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.location?.toLowerCase().includes(search.toLowerCase()),
      )
    : facilities;

  return (
    <Box>
      {/* Page header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Sports Facilities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and book available campus sports facilities
        </Typography>
      </Box>

      {/* Search + filter row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={4}
      >
        <TextField
          placeholder="Search by name or location…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: { sm: 320 } }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {types.map((type) => {
            const isActive = activeType === type;
            const sportColor =
              type !== "All" ? sportMeta[type]?.color : undefined;
            return (
              <Chip
                key={type}
                label={type}
                clickable
                onClick={() => handleFilter(type)}
                color={isActive && !sportColor ? "primary" : "default"}
                variant={isActive ? "filled" : "outlined"}
                sx={{
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: "8px",
                  ...(sportColor
                    ? isActive
                      ? {
                          bgcolor: sportColor,
                          color: "#fff",
                          borderColor: sportColor,
                          "&:hover": {
                            bgcolor: sportColor,
                            filter: "brightness(0.9)",
                          },
                        }
                      : {
                          borderColor: sportColor,
                          color: sportColor,
                          "&:hover": { bgcolor: `${sportColor}18` },
                        }
                    : {}),
                }}
              />
            );
          })}
        </Stack>
      </Stack>

      {/* Content */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <FacilityCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Box textAlign="center" py={10}>
          <InboxIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            No facilities found
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={0.5}>
            Try adjusting your search or filter
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((facility) => {
            const meta = sportMeta[facility.type] || {
              Icon: SportsIcon,
              color: "#1565c0",
              bg: "linear-gradient(135deg,#1565c0,#1e88e5)",
            };
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={facility._id}>
                <Link
                  to={`/facilities/${facility._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.22s ease",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: 5,
                        transform: "translateY(-4px)",
                        borderColor: "transparent",
                      },
                      "&:hover .card-arrow": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    }}
                  >
                    {/* Header */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={2.5}
                    >
                      <Avatar
                        sx={{
                          background: meta.bg,
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      >
                        <meta.Icon sx={{ fontSize: 24, color: "#fff" }} />
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>
                          {facility.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: meta.color, fontWeight: 600 }}
                        >
                          {facility.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={facility.status}
                        size="small"
                        color={
                          facility.status === "Active" ? "success" : "error"
                        }
                        sx={{ fontWeight: 700, flexShrink: 0 }}
                      />
                    </Stack>

                    {/* Info rows */}
                    <Stack spacing={1.5} flex={1}>
                      <InfoRow
                        icon={
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ color: "success.main" }}
                          />
                        }
                        label="Location"
                        value={facility.location}
                      />
                      <InfoRow
                        icon={
                          <PeopleIcon
                            fontSize="small"
                            sx={{ color: "success.main" }}
                          />
                        }
                        label="Capacity"
                        value={`${facility.capacity} people`}
                      />
                    </Stack>

                    {/* Footer CTA */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      mt={2.5}
                      pt={2}
                      sx={{ borderTop: "1px solid", borderColor: "divider" }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ color: meta.color }}
                      >
                        View & Book
                      </Typography>
                      <ArrowForwardIcon
                        className="card-arrow"
                        sx={{
                          fontSize: 14,
                          color: meta.color,
                          opacity: 0,
                          transform: "translateX(-4px)",
                          transition: "all 0.2s ease",
                        }}
                      />
                    </Stack>
                  </Paper>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
