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
  Grid,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toaster } from "../components/Toaster";
import AuthLayout from "../components/AuthLayout";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "studentId" ? value.replace(/\D/g, "") : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toaster.create({ title: "Passwords do not match", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.studentId, form.email, form.password);
      toaster.create({
        title: "Account created! Welcome to UniSport",
        type: "success",
      });
      navigate("/facilities");
    } catch (err) {
      const message = err.response?.data?.error || "Registration failed";
      toaster.create({ title: "Error", description: message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* Header */}
            <Stack spacing={0.5} alignItems="center" mb={0.5}>
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
                Create account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join UniSport and start booking today
              </Typography>
            </Stack>

            {/* Name + Student ID side by side */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={(theme) => ({
                    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      caretColor: theme.palette.text.primary,
                      transition: "background-color 5000s ease-in-out 0s",
                    },
                    "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset": {
                      borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
                    },
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Student ID"
                  name="studentId"
                  placeholder="e.g. 123456"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  sx={(theme) => ({
                    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      caretColor: theme.palette.text.primary,
                      transition: "background-color 5000s ease-in-out 0s",
                    },
                    "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset": {
                      borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
                    },
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              sx={(theme) => ({
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: theme.palette.text.primary,
                  caretColor: theme.palette.text.primary,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset": {
                  borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
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
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              sx={(theme) => ({
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: theme.palette.text.primary,
                  caretColor: theme.palette.text.primary,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset": {
                  borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
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

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              sx={(theme) => ({
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: theme.palette.text.primary,
                  caretColor: theme.palette.text.primary,
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill ~ fieldset, & input:-webkit-autofill:hover ~ fieldset, & input:-webkit-autofill:focus ~ fieldset, & input:-webkit-autofill:active ~ fieldset": {
                  borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
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
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                    >
                      {showConfirm ? (
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
              {loading ? "Creating account…" : "Create Account"}
            </Button>

            <Divider sx={{ my: -0.5 }}>
              <Typography variant="caption" color="text.disabled" px={1}>
                Already have an account?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
              size="large"
              sx={{ py: 1.4 }}
            >
              Sign in instead
            </Button>
          </Stack>
        </form>
      </Paper>
    </AuthLayout>
  );
}
