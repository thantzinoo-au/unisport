import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toaster } from "../components/Toaster";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toaster.create({ title: "Welcome back!", type: "success" });
      navigate(
        data.user?.role === "Admin" ? "/admin/dashboard" : "/my-bookings",
      );
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack spacing={0.5} alignItems="center" mb={1}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: "14px",
                  p: 1.2,
                  display: "inline-flex",
                  mb: 1,
                }}
              >
                <SportsSoccerIcon sx={{ fontSize: 26, color: "#fff" }} />
              </Box>
              <Typography variant="h4" fontWeight={800}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your UniSport account
              </Typography>
            </Stack>

            <TextField
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={(theme) => ({
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                  {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                    WebkitTextFillColor: theme.palette.text.primary,
                    caretColor: theme.palette.text.primary,
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset":
                  {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.23)"
                        : "rgba(0,0,0,0.23)",
                  },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon
                      fontSize="small"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              sx={(theme) => ({
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                  {
                    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                    WebkitTextFillColor: theme.palette.text.primary,
                    caretColor: theme.palette.text.primary,
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset":
                  {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.23)"
                        : "rgba(0,0,0,0.23)",
                  },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      fontSize="small"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ py: 1.4 }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>

            <Divider sx={{ my: -0.5 }}>
              <Typography variant="caption" color="text.disabled" px={1}>
                New to UniSport?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/register"
              variant="outlined"
              fullWidth
              size="large"
              sx={{ py: 1.4 }}
            >
              Create an account
            </Button>
          </Stack>
        </form>
      </Paper>
    </AuthLayout>
  );
}
