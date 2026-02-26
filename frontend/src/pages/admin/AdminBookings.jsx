import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Skeleton,
  Stack,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../../api/axios";
import { toaster } from "../../components/Toaster";

const statusMeta = {
  Confirmed: { color: "success", label: "Confirmed" },
  Cancelled: { color: "error", label: "Cancelled" },
  Completed: { color: "primary", label: "Completed" },
};

const sportTypeColors = {
  Snooker: { bg: "#ede9fe", color: "#6366f1", darkBg: "rgba(99,102,241,0.18)" },
  Football: { bg: "#dcfce7", color: "#16a34a", darkBg: "rgba(22,163,74,0.18)" },
  Badminton: {
    bg: "#fef3c7",
    color: "#d97706",
    darkBg: "rgba(217,119,6,0.18)",
  },
};

function SportTypeChip({ type }) {
  const c = sportTypeColors[type];
  if (!type) return null;
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: "0.68rem",
        height: 20,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? (c?.darkBg ?? "action.selected")
            : (c?.bg ?? "action.selected"),
        color: c?.color ?? "text.primary",
        border: "none",
      }}
    />
  );
}

const headerSx = {
  fontWeight: 700,
  color: "text.secondary",
  fontSize: "0.75rem",
  textTransform: "uppercase",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // booking _id being actioned
  const [confirm, setConfirm] = useState(null); // { booking, action: "Cancelled"|"Completed" }

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const fetchBookings = useCallback(() => {
    setLoading(true);
    api
      .get("/bookings")
      .then((res) => setBookings(res.data.bookings))
      .catch(() =>
        toaster.create({ title: "Failed to load bookings", type: "error" }),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async () => {
    if (!confirm) return;
    const { booking, action } = confirm;
    setConfirm(null);
    setActionLoading(booking._id);
    try {
      await api.put(`/bookings/${booking._id}`, { status: action });
      toaster.create({
        title:
          action === "Cancelled"
            ? "Booking cancelled"
            : "Booking marked as completed",
        type: "success",
      });
      fetchBookings();
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Action failed",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    if (dateFilter && b.date !== dateFilter) return false;
    if (nameFilter) {
      const q = nameFilter.toLowerCase();
      const name = (b.userId?.name || "").toLowerCase();
      const sid = (b.userId?.studentId || "").toLowerCase();
      const facility = (b.facilityId?.name || "").toLowerCase();
      if (!name.includes(q) && !sid.includes(q) && !facility.includes(q))
        return false;
    }
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Booking Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, cancel, or complete any booking
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchBookings} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, mb: 3 }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {["All", "Confirmed", "Cancelled", "Completed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="Date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            label="Search user / facility"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
            placeholder="Name, student ID, or facility"
          />
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => {
              setStatusFilter("All");
              setDateFilter("");
              setNameFilter("");
            }}
          >
            Clear
          </Button>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
        <Box
          px={3}
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        {loading ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerSx}>User</TableCell>
                  <TableCell sx={headerSx}>Facility</TableCell>
                  <TableCell sx={headerSx}>Date</TableCell>
                  <TableCell sx={headerSx}>Time</TableCell>
                  <TableCell sx={headerSx}>Status</TableCell>
                  <TableCell sx={headerSx} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width={100} />
                      <Skeleton width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={90} />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rounded"
                        width={70}
                        height={22}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton
                        variant="rounded"
                        width={64}
                        height={28}
                        sx={{ borderRadius: 1, ml: "auto" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : filtered.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerSx}>User</TableCell>
                  <TableCell sx={headerSx}>Facility</TableCell>
                  <TableCell sx={headerSx}>Date</TableCell>
                  <TableCell sx={headerSx}>Time</TableCell>
                  <TableCell sx={headerSx}>Status</TableCell>
                  <TableCell sx={headerSx} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((booking) => {
                  const isActioning = actionLoading === booking._id;
                  const canAct = booking.status === "Confirmed";
                  return (
                    <TableRow key={booking._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {booking.userId?.name || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.userId?.studentId || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" mb={0.25}>
                          {booking.facilityId?.name || "Unknown"}
                        </Typography>
                        {booking.facilityId?.type && (
                          <SportTypeChip type={booking.facilityId.type} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{booking.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {booking.startTime} – {booking.endTime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            statusMeta[booking.status]?.label || booking.status
                          }
                          size="small"
                          color={statusMeta[booking.status]?.color || "default"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {canAct && (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="Mark as Completed">
                              <span>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  disabled={isActioning}
                                  onClick={() =>
                                    setConfirm({ booking, action: "Completed" })
                                  }
                                >
                                  {isActioning ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <CheckCircleOutlineIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Cancel Booking">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={isActioning}
                                  onClick={() =>
                                    setConfirm({ booking, action: "Cancelled" })
                                  }
                                >
                                  <CancelOutlinedIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box py={6} textAlign="center">
            <Typography color="text.secondary" variant="body2">
              No bookings match your filters
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {confirm?.action === "Cancelled"
            ? "Cancel Booking"
            : "Complete Booking"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirm?.action === "Cancelled"
              ? "Are you sure you want to cancel this booking? This cannot be undone."
              : "Mark this booking as completed?"}
          </DialogContentText>
          {confirm && (
            <Box mt={2}>
              <Typography variant="body2">
                <strong>User:</strong> {confirm.booking.userId?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Facility:</strong> {confirm.booking.facilityId?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {confirm.booking.date} &nbsp;
                {confirm.booking.startTime} – {confirm.booking.endTime}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirm(null)} color="inherit">
            Back
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={confirm?.action === "Cancelled" ? "error" : "primary"}
          >
            {confirm?.action === "Cancelled"
              ? "Cancel Booking"
              : "Mark Completed"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
