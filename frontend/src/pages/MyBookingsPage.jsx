import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
  Skeleton,
  alpha,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CasinoIcon from "@mui/icons-material/Casino";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsIcon from "@mui/icons-material/Sports";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { toaster } from "../components/Toaster";

const sportMeta = {
  Snooker: {
    Icon: CasinoIcon,
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

const statusChipColor = {
  Confirmed: "success",
  Cancelled: "error",
  Completed: "primary",
};

function BookingSkeleton() {
  return (
    <Stack spacing={0} sx={{ position: "relative", pl: 5 }}>
      {/* timeline dot */}
      <Box
        sx={{
          position: "absolute",
          left: 11,
          top: 24,
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: "action.disabledBackground",
          border: "2px solid",
          borderColor: "background.paper",
        }}
      />
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton
            variant="rounded"
            width={44}
            height={44}
            sx={{ borderRadius: 2, flexShrink: 0 }}
          />
          <Box flex={1}>
            <Skeleton width="55%" height={22} />
            <Skeleton width="35%" height={16} sx={{ mt: 0.5 }} />
          </Box>
          <Skeleton
            variant="rounded"
            width={80}
            height={26}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
        <Stack direction="row" spacing={3} mt={2}>
          <Skeleton width={100} height={16} />
          <Skeleton width={120} height={16} />
          <Skeleton width={90} height={16} />
        </Stack>
      </Paper>
    </Stack>
  );
}

function EmptyState({ tab }) {
  return (
    <Box textAlign="center" py={10}>
      <EventBusyIcon
        sx={{ fontSize: 72, color: "text.disabled", mb: 2, opacity: 0.5 }}
      />
      <Typography variant="h6" fontWeight={700} color="text.secondary" mb={0.5}>
        {tab === 0 ? "No bookings yet" : "No past bookings"}
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        {tab === 0
          ? "You haven't made any bookings. Find a facility and get started!"
          : "Completed and cancelled bookings will appear here."}
      </Typography>
      {tab === 0 && (
        <Button
          component={Link}
          to="/facilities"
          variant="contained"
          size="large"
          endIcon={<span>→</span>}
        >
          Browse Facilities
        </Button>
      )}
    </Box>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [tab, setTab] = useState(0);

  const fetchBookings = () => {
    setLoading(true);
    api
      .get("/bookings")
      .then((res) => setBookings(res.data.bookings))
      .catch(() => {
        setBookings([]);
        toaster.create({ title: "Failed to load bookings", type: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}`, { status: "Cancelled" });
      toaster.create({ title: "Booking cancelled", type: "success" });
      fetchBookings();
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Failed to cancel",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();

  const upcoming = bookings.filter((b) => {
    if (b.status === "Cancelled") return false;
    const end = new Date(`${b.date}T${b.endTime}`);
    return end >= now;
  });

  const past = bookings.filter((b) => {
    if (b.status === "Cancelled") return true;
    const end = new Date(`${b.date}T${b.endTime}`);
    return end < now;
  });

  const displayList = tab === 0 ? upcoming : past;

  const upcomingCount = upcoming.length;
  const pastCount = past.length;

  function BookingCard({ booking }) {
    const meta = sportMeta[booking.facilityId?.type] || {
      Icon: SportsIcon,
      bg: "linear-gradient(135deg,#1565c0,#1e88e5)",
      color: "#1565c0",
    };
    const FacilityIcon = meta.Icon;
    const bookingEnd = new Date(`${booking.date}T${booking.endTime}`);
    const isUpcomingConfirmed =
      booking.status === "Confirmed" && bookingEnd >= now;

    return (
      <Stack direction="row" spacing={0} sx={{ position: "relative", pl: 5 }}>
        {/* Timeline dot */}
        <Box
          sx={{
            position: "absolute",
            left: 10,
            top: 26,
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: isUpcomingConfirmed ? meta.color : "action.disabled",
            border: "2px solid",
            borderColor: "background.paper",
            boxShadow: isUpcomingConfirmed
              ? `0 0 0 3px ${alpha(meta.color, 0.2)}`
              : "none",
            zIndex: 1,
          }}
        />

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: isUpcomingConfirmed
              ? alpha(meta.color, 0.25)
              : "divider",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: 3 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
            mb={2}
          >
            {/* Left: icon + name */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  background: meta.bg,
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              >
                <FacilityIcon sx={{ fontSize: 22, color: "#fff" }} />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  lineHeight={1.2}
                >
                  {booking.facilityId?.name || "Unknown Facility"}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: meta.color }}
                >
                  {booking.facilityId?.type || "—"}
                </Typography>
              </Box>
            </Stack>

            {/* Right: status + cancel */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexShrink={0}
            >
              <Chip
                label={booking.status}
                size="small"
                color={statusChipColor[booking.status] || "default"}
                sx={{ fontWeight: 700 }}
              />
              {isUpcomingConfirmed && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={cancellingId !== null}
                  onClick={() => setCancelConfirmId(booking._id)}
                  sx={{ minWidth: 80 }}
                >
                  {cancellingId === booking._id ? "Cancelling…" : "Cancel"}
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Detail row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 3 }}
            flexWrap="wrap"
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthIcon
                sx={{ fontSize: 15, color: "text.disabled" }}
              />
              <Typography variant="body2" color="text.secondary">
                {booking.date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 15, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">
                {booking.startTime} – {booking.endTime}
              </Typography>
            </Stack>
            {booking.facilityId?.location && (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <LocationOnIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                <Typography variant="body2" color="text.secondary">
                  {booking.facilityId.location}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          My Bookings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage all your facility reservations
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": { borderRadius: 2, height: 3 },
        }}
      >
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Upcoming</span>
              {!loading && (
                <Chip
                  label={upcomingCount}
                  size="small"
                  color={upcomingCount > 0 ? "primary" : "default"}
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                />
              )}
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Past</span>
              {!loading && (
                <Chip
                  label={pastCount}
                  size="small"
                  color="default"
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                />
              )}
            </Stack>
          }
        />
      </Tabs>

      {/* Content */}
      {loading ? (
        /* Timeline line behind skeletons */
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              left: 15,
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: "divider",
              borderRadius: 1,
            }}
          />
          <Stack spacing={2.5}>
            {[...Array(3)].map((_, i) => (
              <BookingSkeleton key={i} />
            ))}
          </Stack>
        </Box>
      ) : displayList.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <Box sx={{ position: "relative" }}>
          {/* Timeline vertical line */}
          <Box
            sx={{
              position: "absolute",
              left: 15,
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: "divider",
              borderRadius: 1,
            }}
          />
          <Stack spacing={2.5}>
            {displayList.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Cancel Confirmation Modal */}
      {(() => {
        const booking = bookings.find((b) => b._id === cancelConfirmId);
        return (
          <Dialog
            open={Boolean(cancelConfirmId)}
            onClose={() => setCancelConfirmId(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              Cancel Booking
            </DialogTitle>
            <DialogContent>
              <DialogContentText mb={2}>
                Are you sure you want to cancel? This action cannot be undone.
              </DialogContentText>
              {booking && (
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
                        {booking.facilityId?.name || "Unknown"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {booking.date}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {booking.startTime} – {booking.endTime}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button
                onClick={() => setCancelConfirmId(null)}
                color="inherit"
                variant="outlined"
                sx={{ flex: 1 }}
              >
                Keep Booking
              </Button>
              <Button
                onClick={() => {
                  const id = cancelConfirmId;
                  setCancelConfirmId(null);
                  handleCancel(id);
                }}
                variant="contained"
                color="error"
                sx={{ flex: 1 }}
              >
                Yes, Cancel
              </Button>
            </DialogActions>
          </Dialog>
        );
      })()}
    </Box>
  );
}
