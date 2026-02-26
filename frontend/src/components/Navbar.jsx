import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ColorModeContext";

const getProfileImageUrl = (filename) => {
  if (!filename) return undefined;
  return `/uploads/${filename}`;
};

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive =
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Button
        color="inherit"
        sx={{
          position: "relative",
          color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
          fontWeight: isActive ? 700 : 500,
          "&::after": isActive
            ? {
                content: '""',
                position: "absolute",
                bottom: 4,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: 2,
                borderRadius: 1,
                bgcolor: "#fff",
              }
            : {},
          "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        {children}
      </Button>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const initials = user
    ? (user.name || user.email || "U")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const avatarSrc = user?.profileImage
    ? getProfileImageUrl(user.profileImage)
    : undefined;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)"
              : "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
          borderBottom: (theme) => `1px solid ${alpha("#fff", 0.12)}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  p: 0.6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SportsSoccerIcon sx={{ fontSize: 22, color: "#fff" }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: "#fff", letterSpacing: "-0.3px" }}
              >
                UniSport
              </Typography>
            </Stack>
          </Link>

          {/* Right side */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {/* Desktop nav links — hide on mobile */}
            {!isMobile && (
              <>
                <NavLink to="/facilities">Facilities</NavLink>
                {user && (
                  <>
                    {user.role === "Admin" ? (
                      <>
                        <NavLink to="/admin/dashboard">Dashboard</NavLink>
                        <NavLink to="/admin/bookings">Bookings</NavLink>
                        <NavLink to="/admin/facilities">Manage</NavLink>
                      </>
                    ) : (
                      <NavLink to="/my-bookings">My Bookings</NavLink>
                    )}
                  </>
                )}
              </>
            )}

            {/* Dark / light toggle */}
            <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"} arrow>
              <IconButton
                onClick={toggleColorMode}
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                  },
                }}
              >
                {mode === "dark" ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                <Tooltip title="Account" arrow>
                  <IconButton onClick={handleAvatarClick} sx={{ p: 0.5 }}>
                    <Avatar
                      src={avatarSrc}
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        bgcolor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "2px solid rgba(255,255,255,0.4)",
                        cursor: "pointer",
                      }}
                    >
                      {!avatarSrc && initials}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      overflow: "visible",
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {user.name || "User"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                    sx={{ py: 1.2 }}
                  >
                    <ListItemIcon>
                      <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{ py: 1.2, color: "error.main" }}
                  >
                    <ListItemIcon>
                      <LogoutIcon
                        fontSize="small"
                        sx={{ color: "error.main" }}
                      />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : !isMobile ? (
              <Stack direction="row" spacing={0.5} ml={0.5}>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button
                    color="inherit"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "#fff",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontWeight: 600,
                      border: "1px solid rgba(255,255,255,0.35)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      boxShadow: "none",
                    }}
                  >
                    Register
                  </Button>
                </Link>
              </Stack>
            ) : null}

            {/* Mobile hamburger button */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                size="small"
                sx={{
                  color: "#fff",
                  ml: 0.5,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile side Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 260, pt: 1 },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Menu
          </Typography>
          <IconButton size="small" onClick={() => setMobileOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />

        {user && (
          <>
            <Box sx={{ px: 2, py: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={avatarSrc}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    bgcolor: "primary.main",
                  }}
                >
                  {!avatarSrc && initials}
                </Avatar>
                <Box minWidth={0}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {user.name || "User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Divider />
          </>
        )}

        <List dense sx={{ pt: 1 }}>
          {[
            { label: "Facilities", to: "/facilities" },
            ...(user
              ? user.role === "Admin"
                ? [
                    { label: "Dashboard", to: "/admin/dashboard" },
                    { label: "Bookings", to: "/admin/bookings" },
                    { label: "Manage Facilities", to: "/admin/facilities" },
                  ]
                : [{ label: "My Bookings", to: "/my-bookings" }]
              : []),
            ...(user
              ? [
                  {
                    label: "My Profile",
                    to: "/profile",
                    icon: <PersonOutlineIcon fontSize="small" />,
                  },
                ]
              : []),
          ].map(({ label, to, icon }) => (
            <ListItem key={to} disablePadding>
              <ListItemButton
                component={Link}
                to={to}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                {icon && (
                  <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                )}
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {!user && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  sx={{ borderRadius: 1, mx: 1 }}
                >
                  <ListItemText
                    primary="Login"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  sx={{ borderRadius: 1, mx: 1 }}
                >
                  <ListItemText
                    primary="Register"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        {user && (
          <>
            <Divider sx={{ mt: "auto" }} />
            <List dense>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{ borderRadius: 1, mx: 1, color: "error.main" }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "error.main",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
    </>
  );
}
