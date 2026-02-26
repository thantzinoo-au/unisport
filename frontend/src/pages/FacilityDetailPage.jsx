import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Stack,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Tooltip,
  Skeleton,
  Divider,
  alpha,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PoolIcon from "@mui/icons-material/Pool";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsIcon from "@mui/icons-material/Sports";
import BuildIcon from "@mui/icons-material/Build";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toaster } from "../components/Toaster";

const sportMeta = {
  Snooker: {
    Icon: PoolIcon,
    bg: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#6366f1",
  },
  Football: {
    Icon: SportsSoccerIcon,
    bg: "linear-gradient(135deg,#16a34a,#22c55e)",
    color: "#16a34a",
  },
  Badminton: {
    Icon: SportsTennisIcon,
    bg: "linear-gradient(135deg,#d97706,#f59e0b)",
    color: "#d97706",
  },
};

function SlotSkeleton() {
  return (
    <Grid container spacing={1.5}>
      {[...Array(8)].map((_, i) => (
        <Grid item key={i}>
          <Skeleton
            variant="rounded"
            width={120}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default function FacilityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [confirmSlot, setConfirmSlot] = useState(null);

  useEffect(() => {
    api
      .get(`/facilities/${id}`)
      .then((res) => setFacility(res.data.facility))
      .catch(() => navigate("/facilities"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!date || !id) return;
    setSlotsLoading(true);
    api
      .get("/bookings/availability", { params: { facilityId: id, date } })
      .then((res) => {
        setSlots(res.data.slots);
        setAllSlots(res.data.allSlots);
      })
      .catch(() => {
        setSlots([]);
        setAllSlots([]);
        toaster.create({ title: "Failed to load time slots", type: "error" });
      })
      .finally(() => setSlotsLoading(false));
  }, [date, id]);

  const handleBook = (slot) => {
    if (!user) {
      toaster.create({ title: "Please login to book", type: "warning" });
      navigate("/login");
      return;
    }
    setConfirmSlot(slot);
  };

  const handleConfirmBook = async () => {
    if (!confirmSlot) return;
    const slot = confirmSlot;
    setConfirmSlot(null);
    setBooking(true);
    try {
      await api.post("/bookings", {
        facilityId: id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      toaster.create({ title: "Booking confirmed!", type: "success" });
      const res = await api.get("/bookings/availability", {
        params: { facilityId: id, date },
      });
      setSlots(res.data.slots);
      setAllSlots(res.data.allSlots);
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Booking failed",
        type: "error",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (!facility) return null;

  const meta = sportMeta[facility.type] || {
    Icon: SportsIcon,
    bg: "linear-gradient(135deg,#1565c0,#1e88e5)",
    color: "#1565c0",
  };
  const FacilityIcon = meta.Icon;

  const availableSet = new Set(slots.map((s) => s.startTime));
  const today = new Date().toLocaleDateString("en-CA");

  return (
    <Box>
      {/* Back link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/facilities")}
        sx={{ mb: 2, color: "text.secondary", fontWeight: 500 }}
      >
        All Facilities
      </Button>

      {/* ── Hero banner ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Gradient header */}
        <Box
          sx={{
            background: meta.bg,
            px: { xs: 3, md: 4 },
            py: 3.5,
            display: "flex",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.35)",
              borderRadius: 2.5,
              flexShrink: 0,
            }}
          >
            <FacilityIcon sx={{ fontSize: 34, color: "#fff" }} />
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography variant="h4" fontWeight={800} color="#fff" noWrap>
              {facility.name}
            </Typography>
            <Stack direction="row" spacing={1} mt={0.75}>
              <Chip
                label={facility.type}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.22)",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "6px",
                }}
              />
              <Chip
                label={facility.status}
                size="small"
                color={facility.status === "Active" ? "success" : "error"}
                sx={{ fontWeight: 700, borderRadius: "6px" }}
              />
            </Stack>
          </Box>
        </Box>

        {/* Info row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ px: { xs: 3, md: 4 }, py: 2.5 }}
          spacing={3}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha(meta.color, 0.12),
                borderRadius: "10px",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 18, color: meta.color }} />
            </Avatar>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Location
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {facility.location}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha(meta.color, 0.12),
                borderRadius: "10px",
              }}
            >
              <PeopleIcon sx={{ fontSize: 18, color: meta.color }} />
            </Avatar>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Capacity
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {facility.capacity} people
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* ── Maintenance state ── */}
      {facility.status === "Maintenance" ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.light",
            textAlign: "center",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha("#ef4444", 0.08)
                : "#fff5f5",
          }}
        >
          <BuildIcon sx={{ fontSize: 48, color: "error.main", mb: 1.5 }} />
          <Typography variant="h6" fontWeight={700} color="error.main" mb={0.5}>
            Under Maintenance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This facility is temporarily unavailable. Please check back later.
          </Typography>
        </Paper>
      ) : (
        /* ── Booking panel ── */
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Admin notice */}
          {user?.role === "Admin" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2.5,
                mb: 3,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha("#0288d1", 0.15)
                    : "#e3f2fd",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha("#0288d1", 0.3)
                    : "#90caf9",
              }}
            >
              <AdminPanelSettingsIcon
                sx={{ color: "info.main", flexShrink: 0 }}
              />
              <Box>
                <Typography fontWeight={700} variant="body2" color="info.main">
                  Admin View — Read Only
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  You can view availability here. Booking is reserved for
                  students.
                </Typography>
              </Box>
            </Box>
          )}

          {!user?.role === "Admin" && (
            <Typography variant="h5" fontWeight={700} mb={3}>
              Book a Time Slot
            </Typography>
          )}

          {/* Date picker */}
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <CalendarMonthIcon sx={{ color: "text.disabled" }} />
            <Typography fontWeight={600}>Select a date</Typography>
          </Stack>
          <TextField
            type="date"
            value={date}
            inputProps={{ min: today }}
            onChange={(e) => setDate(e.target.value)}
            size="small"
            sx={{ mb: 4, maxWidth: 240 }}
          />

          {/* Slots */}
          {date && (
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontWeight={600}>Time Slots — {date}</Typography>
                {/* Legend */}
                <Stack direction="row" spacing={2}>
                  {[
                    { color: "success.main", border: true, label: "Available" },
                    { bgcolor: "error.main", label: "Booked" },
                    { bgcolor: "action.disabledBackground", label: "Past" },
                  ].map(({ color, border, bgcolor, label }) => (
                    <Stack
                      key={label}
                      direction="row"
                      spacing={0.75}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "4px",
                          bgcolor: bgcolor || "transparent",
                          border: border ? "2px solid" : "none",
                          borderColor: color,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {slotsLoading ? (
                <SlotSkeleton />
              ) : (
                <Grid container spacing={1.5}>
                  {allSlots.map((slot) => {
                    const isAvailable = availableSet.has(slot.startTime);
                    const isPast =
                      date === today &&
                      new Date(`${date}T${slot.startTime}`) <= new Date();
                    const isAdmin = user?.role === "Admin";

                    const tooltipTitle = isPast
                      ? "This slot has already passed"
                      : !isAvailable
                        ? "Already booked"
                        : isAdmin
                          ? "Booking reserved for students"
                          : "";

                    const slotBtn = (
                      <Button
                        size="small"
                        variant={
                          isAvailable && !isPast ? "outlined" : "contained"
                        }
                        disabled={!isAvailable || isPast || booking || isAdmin}
                        onClick={() =>
                          isAvailable && !isPast && !isAdmin && handleBook(slot)
                        }
                        sx={{
                          minWidth: 120,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          borderRadius: 2,
                          py: 0.9,
                          ...(isAvailable && !isPast && !isAdmin
                            ? {
                                borderColor: "success.main",
                                color: "success.main",
                                "&:hover": {
                                  bgcolor: alpha("#16a34a", 0.08),
                                  borderColor: "success.dark",
                                },
                              }
                            : !isAvailable && !isPast
                              ? {
                                  bgcolor: alpha("#ef4444", 0.12),
                                  color: "error.main",
                                  "&.Mui-disabled": {
                                    bgcolor: alpha("#ef4444", 0.1),
                                    color: "error.main",
                                    opacity: 0.75,
                                  },
                                }
                              : {
                                  "&.Mui-disabled": {
                                    bgcolor: "action.disabledBackground",
                                    color: "text.disabled",
                                  },
                                }),
                        }}
                      >
                        {slot.startTime}–{slot.endTime}
                      </Button>
                    );

                    return (
                      <Grid item key={slot.startTime}>
                        {tooltipTitle ? (
                          <Tooltip title={tooltipTitle} arrow placement="top">
                            <span>{slotBtn}</span>
                          </Tooltip>
                        ) : (
                          slotBtn
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* ── Confirm dialog ── */}
      <Dialog
        open={Boolean(confirmSlot)}
        onClose={() => setConfirmSlot(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Confirm Booking
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Please confirm your booking details below.
          </DialogContentText>
          {confirmSlot && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Facility
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {facility?.name}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {date}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {confirmSlot.startTime} – {confirmSlot.endTime}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmSlot(null)}
            color="inherit"
            variant="outlined"
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBook}
            variant="contained"
            color="primary"
            sx={{ flex: 1 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
