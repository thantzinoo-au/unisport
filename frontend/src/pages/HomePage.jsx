import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Paper,
  Avatar,
  alpha,
} from "@mui/material";
import { Link } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PoolIcon from "@mui/icons-material/Pool";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const categories = [
  {
    name: "Snooker",
    description: "Reserve snooker tables for casual or competitive play",
    Icon: PoolIcon,
    color: "#6366f1",
    bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  {
    name: "Football",
    description: "Book football fields for team practice or friendly matches",
    Icon: SportsSoccerIcon,
    color: "#16a34a",
    bg: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
  },
  {
    name: "Badminton",
    description: "Secure badminton courts for singles or doubles games",
    Icon: SportsTennisIcon,
    color: "#d97706",
    bg: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
  },
];

const steps = [
  {
    Icon: SearchIcon,
    label: "Browse",
    desc: "Find available facilities by type and location",
    color: "#1565c0",
  },
  {
    Icon: CalendarMonthIcon,
    label: "Select",
    desc: "Pick your preferred date and time slot",
    color: "#00897b",
  },
  {
    Icon: CheckCircleOutlineIcon,
    label: "Book",
    desc: "Confirm your booking instantly — you're all set",
    color: "#16a34a",
  },
];

export default function HomePage() {
  return (
    <Stack spacing={6} py={2}>
      {/* Hero */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0288d1 100%)"
              : "linear-gradient(135deg, #1565c0 0%, #1e88e5 50%, #0288d1 100%)",
          borderRadius: 4,
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 9 },
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.06)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          },
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              p: 1.5,
              display: "inline-flex",
              backdropFilter: "blur(4px)",
            }}
          >
            <SportsSoccerIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Box>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{ color: "#fff", lineHeight: 1.1, mb: 1 }}
            >
              UniSport
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontWeight: 400,
                maxWidth: 480,
                mx: "auto",
              }}
            >
              Campus sports facility booking — quick, fair, and hassle-free.
            </Typography>
          </Box>
          <Link to="/facilities" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#fff",
                color: "primary.main",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.92)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                },
                transition: "all 0.2s",
              }}
            >
              Browse All Facilities
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* Sport Category Cards */}
      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.5}>
          Browse by Sport
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Choose your sport to see available facilities
        </Typography>
        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid item xs={12} md={4} key={cat.name}>
              <Link
                to={`/facilities?type=${encodeURIComponent(cat.name)}`}
                style={{ textDecoration: "none" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    transition: "all 0.22s ease",
                    overflow: "hidden",
                    position: "relative",
                    "&:hover": {
                      boxShadow: 5,
                      transform: "translateY(-4px)",
                      borderColor: "transparent",
                    },
                    "&:hover .sport-icon-bg": {
                      transform: "scale(1.08)",
                    },
                  }}
                >
                  {/* Accent top bar */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: cat.bg,
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <Stack spacing={2} mt={1}>
                    <Avatar
                      className="sport-icon-bg"
                      sx={{
                        background: cat.bg,
                        width: 56,
                        height: 56,
                        transition: "transform 0.22s ease",
                      }}
                    >
                      <cat.Icon sx={{ fontSize: 28, color: "#fff" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700} mb={0.5}>
                        {cat.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        lineHeight={1.6}
                      >
                        {cat.description}
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ color: cat.color }}
                      >
                        View facilities
                      </Typography>
                      <ArrowForwardIcon
                        sx={{ fontSize: 14, color: cat.color }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works */}
      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.5}>
          How It Works
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Get booked in three simple steps
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "flex-start" }}
            spacing={{ xs: 4, md: 0 }}
          >
            {steps.map(({ Icon, label, desc, color }, idx) => (
              <Stack
                key={label}
                direction={{ xs: "row", md: "column" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                flex={1}
                spacing={2}
                sx={{ position: "relative" }}
              >
                {/* Connector line (between steps, desktop only) */}
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: 28,
                      left: "calc(50% + 28px)",
                      right: "calc(-50% + 28px)",
                      height: 2,
                      bgcolor: "divider",
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Step icon */}
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: alpha(color, 0.12),
                      border: `2px solid ${alpha(color, 0.3)}`,
                    }}
                  >
                    <Icon sx={{ fontSize: 26, color }} />
                  </Avatar>
                  <Avatar
                    sx={{
                      width: 22,
                      height: 22,
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      bgcolor: color,
                      color: "#fff",
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      border: "2px solid",
                      borderColor: "background.paper",
                    }}
                  >
                    {idx + 1}
                  </Avatar>
                </Box>

                {/* Text */}
                <Box textAlign={{ xs: "left", md: "center" }}>
                  <Typography fontWeight={700} mb={0.5}>
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.6}
                  >
                    {desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
