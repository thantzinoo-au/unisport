import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Skeleton,
  Paper,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  color = "text.primary",
  sub,
}) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: 2.5, borderRadius: 2, height: "100%" }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            color="text.secondary"
            variant="caption"
            fontWeight={500}
            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={700} color={color} mt={0.5}>
            {value}
          </Typography>
          {sub && (
            <Typography color="text.secondary" variant="caption">
              {sub}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: iconBg, width: 44, height: 44 }}>
          <Icon sx={{ fontSize: 22, color: "#fff" }} />
        </Avatar>
      </Stack>
    </Paper>
  );
}

const PIE_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
];

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
        mt: 0.25,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? (c?.darkBg ?? "action.selected")
            : (c?.bg ?? "action.selected"),
        color: c?.color ?? "text.primary",
      }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Skeleton width={160} height={32} />
          <Skeleton width={280} height={20} sx={{ mt: 0.5 }} />
        </Box>
        <Stack direction="row" spacing={1}>
          <Skeleton
            variant="rounded"
            width={140}
            height={32}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rounded"
            width={140}
            height={32}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </Box>
      <Skeleton width={80} height={18} sx={{ mb: 1 }} />
      <Grid container spacing={2} mb={3}>
        {[...Array(4)].map((_, i) => (
          <Grid key={i} size={3}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Skeleton width={70} height={16} />
                  <Skeleton width={50} height={40} sx={{ mt: 0.5 }} />
                </Box>
                <Skeleton variant="circular" width={44} height={44} />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Skeleton width={120} height={18} sx={{ mb: 1 }} />
      <Grid container spacing={2} mb={4}>
        {[...Array(4)].map((_, i) => (
          <Grid key={i} size={3}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Skeleton width={80} height={16} />
                  <Skeleton width={55} height={40} sx={{ mt: 0.5 }} />
                </Box>
                <Skeleton variant="circular" width={44} height={44} />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        {[...Array(2)].map((_, i) => (
          <Grid key={i} size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <Skeleton width="50%" height={24} sx={{ mb: 2 }} />
              <Skeleton
                variant="rounded"
                height={280}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function PieChartCard({ title, data }) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, height: "100%" }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {title}
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={85}
              label={({ label, percent }) =>
                `${label} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={{ stroke: "#888", strokeWidth: 1 }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <RechartsTooltip formatter={(v, n) => [v, "Bookings"]} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography color="text.secondary" variant="body2">
          No data yet
        </Typography>
      )}
    </Paper>
  );
}

function BarChartCard({ title, data, color = "#6366f1", vertical = false }) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, height: "100%" }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {title}
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          {vertical ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <RechartsTooltip formatter={(v) => [v, "Bookings"]} />
              <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} />
            </BarChart>
          ) : (
            <BarChart
              data={data}
              margin={{ left: 0, right: 10, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <RechartsTooltip formatter={(v) => [v, "Bookings"]} />
              <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      ) : (
        <Typography color="text.secondary" variant="body2">
          No data yet
        </Typography>
      )}
    </Paper>
  );
}

function LineChartCard({ title, data, color = "#6366f1" }) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, height: "100%" }}
    >
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {title}
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={data}
            margin={{ left: 0, right: 10, top: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <RechartsTooltip formatter={(v) => [v, "Bookings"]} />
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography color="text.secondary" variant="body2">
          No data yet
        </Typography>
      )}
    </Paper>
  );
}

const statusMeta = {
  Confirmed: { color: "success", label: "Confirmed" },
  Cancelled: { color: "error", label: "Cancelled" },
  Completed: { color: "primary", label: "Completed" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirm, setConfirm] = useState(null); // { booking, action }

  const loadStats = useCallback(() => {
    setLoading(true);
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleAction = async () => {
    if (!confirm) return;
    const { booking, action } = confirm;
    setConfirm(null);
    setActionLoading(booking._id);
    try {
      await api.put(`/bookings/${booking._id}`, { status: action });
      loadStats();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="text.secondary">
          Failed to load dashboard data.
        </Typography>
      </Box>
    );
  }

  const {
    overview,
    bookingsByType,
    topFacilities,
    peakHours,
    recentBookings,
    dailyBookings,
    bookingsByDayOfWeek,
    mostActiveUsers,
  } = stats;

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
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of all bookings, users, and facilities
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Link to="/admin/facilities" style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small" disableElevation>
              Manage Facilities
            </Button>
          </Link>
          <Link to="/admin/bookings" style={{ textDecoration: "none" }}>
            <Button variant="outlined" size="small">
              Manage Bookings
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* Booking stats */}
      <Typography variant="overline" color="text.secondary" fontWeight={600}>
        Bookings
      </Typography>
      <Grid container spacing={2} mt={0} mb={3}>
        <Grid size={3}>
          <StatCard
            label="Total"
            value={overview.totalBookings}
            icon={EventNoteIcon}
            iconBg="primary.main"
            color="primary.main"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Confirmed"
            value={overview.confirmedCount}
            icon={CheckCircleOutlineIcon}
            iconBg="success.main"
            color="success.main"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Cancelled"
            value={overview.cancelledCount}
            icon={CancelOutlinedIcon}
            iconBg="error.main"
            color="error.main"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Completed"
            value={overview.completedCount}
            icon={TaskAltIcon}
            iconBg="info.main"
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* System overview */}
      <Typography variant="overline" color="text.secondary" fontWeight={600}>
        System Overview
      </Typography>
      <Grid container spacing={2} mt={0} mb={4}>
        <Grid size={3}>
          <StatCard
            label="Users"
            value={overview.totalUsers}
            icon={PeopleAltOutlinedIcon}
            iconBg="secondary.main"
            color="secondary.main"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Facilities"
            value={overview.totalFacilities}
            icon={BusinessOutlinedIcon}
            iconBg="info.main"
            color="info.main"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Active Facilities"
            value={overview.activeFacilities}
            icon={MeetingRoomOutlinedIcon}
            iconBg="success.main"
            color="success.main"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Cancellation Rate"
            value={`${overview.cancellationRate}%`}
            icon={TrendingDownIcon}
            iconBg={
              overview.cancellationRate > 20 ? "error.main" : "warning.main"
            }
            color={
              overview.cancellationRate > 20 ? "error.main" : "warning.main"
            }
          />
        </Grid>
      </Grid>

      {/* Engagement stats */}
      <Typography variant="overline" color="text.secondary" fontWeight={600}>
        Engagement
      </Typography>
      <Grid container spacing={2} mt={0} mb={4}>
        <Grid size={3}>
          <StatCard
            label="Completion Rate"
            value={`${overview.completionRate}%`}
            icon={VerifiedIcon}
            iconBg="success.main"
            color="success.main"
            sub="Bookings marked completed"
          />
        </Grid>
        <Grid size={3}>
          <StatCard
            label="Avg Bookings / Student"
            value={overview.avgBookingsPerUser}
            icon={PersonSearchIcon}
            iconBg="info.main"
            color="info.main"
            sub="Total bookings ÷ students"
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Charts row 1 */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PieChartCard
            title="Bookings by Sport Type"
            data={bookingsByType.map((b) => ({ label: b._id, count: b.count }))}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BarChartCard
            title="Top Facilities"
            data={topFacilities.map((f) => ({ label: f.name, count: f.count }))}
            color="#a855f7"
            vertical
          />
        </Grid>
      </Grid>

      {/* Charts row 2 */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BarChartCard
            title="Peak Hours"
            data={peakHours
              .slice(0, 8)
              .map((h) => ({ label: h._id, count: h.count }))}
            color="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <LineChartCard
            title="Daily Booking Trend (Last 14 days)"
            data={dailyBookings.map((d) => ({ label: d._id, count: d.count }))}
            color="#06b6d4"
          />
        </Grid>
      </Grid>

      {/* Charts row 3 */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BarChartCard
            title="Bookings by Day of Week"
            data={bookingsByDayOfWeek}
            color="#22c55e"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BarChartCard
            title="Most Active Students"
            data={mostActiveUsers.map((u) => ({
              label: u.name || u.studentId,
              count: u.count,
            }))}
            color="#ec4899"
            vertical
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Recent Bookings */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
        <Box px={3} py={2.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            Recent Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last 10 bookings across all users
          </Typography>
        </Box>
        <Divider />
        {recentBookings.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    User
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Facility
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Time
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {booking.userId?.name || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.userId?.studentId || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
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
                      {booking.status === "Confirmed" && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Mark as Completed" arrow>
                            <span>
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={actionLoading === booking._id}
                                onClick={() =>
                                  setConfirm({ booking, action: "Completed" })
                                }
                              >
                                {actionLoading === booking._id ? (
                                  <CircularProgress size={14} />
                                ) : (
                                  <CheckCircleOutlineIcon fontSize="small" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Cancel Booking" arrow>
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={actionLoading === booking._id}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box py={5} textAlign="center">
            <Typography color="text.secondary" variant="body2">
              No bookings yet
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
              ? "Are you sure you want to cancel this booking?"
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
