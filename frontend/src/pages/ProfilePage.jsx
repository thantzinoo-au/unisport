import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toaster } from "../components/Toaster";

const getProfileImageUrl = (filename) => {
  if (!filename) return undefined;
  return `/uploads/${filename}`;
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profileTab, setProfileTab] = useState(0);

  // Profile info state
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar / profile image state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user?.profileImage ? getProfileImageUrl(user.profileImage) : "",
  );
  const [savingImage, setSavingImage] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toaster.create({ title: "Name cannot be empty", type: "warning" });
      return;
    }
    setSavingProfile(true);
    try {
      const res = await api.put("/auth/profile", { name: name.trim() });
      const updated = res.data.user || { ...user, name: name.trim() };
      updateUser(updated);
      toaster.create({ title: "Name updated successfully", type: "success" });
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Failed to update name",
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveImage = async () => {
    if (!selectedFile) {
      toaster.create({ title: "Please select an image", type: "warning" });
      return;
    }
    setSavingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const res = await api.post("/auth/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res.data.user;
      updateUser(updated);
      setSelectedFile(null);
      setImagePreview(getProfileImageUrl(updated.profileImage));
      toaster.create({ title: "Profile image updated", type: "success" });
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Failed to update image",
        type: "error",
      });
    } finally {
      setSavingImage(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toaster.create({ title: "Please fill in all fields", type: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toaster.create({ title: "New passwords do not match", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      toaster.create({
        title: "Password must be at least 6 characters",
        type: "warning",
      });
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      toaster.create({
        title: "Password changed successfully",
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Failed to change password",
        type: "error",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <Box maxWidth={560} mx="auto">
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Profile
      </Typography>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        {/* Avatar header */}
        <Box
          sx={{
            px: 4,
            pt: 4,
            pb: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(21,101,192,0.18) 0%, rgba(30,136,229,0.10) 100%)"
                : "linear-gradient(135deg, #e3f0ff 0%, #f0f7ff 100%)",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Avatar with overlay camera button */}
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <Avatar
                src={imagePreview || undefined}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: "2rem",
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  border: "3px solid",
                  borderColor: "background.paper",
                  boxShadow: 3,
                }}
              >
                {!imagePreview && initials}
              </Avatar>

              {/* Hidden file input */}
              <input
                accept="image/*"
                id="avatar-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Absolute camera overlay — bottom-right corner */}
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    bgcolor: "background.paper",
                    border: "2px solid",
                    borderColor: "divider",
                    boxShadow: 2,
                    width: 28,
                    height: 28,
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      borderColor: "primary.main",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </label>
            </Box>

            {/* Name, role badge, joined date */}
            <Box flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={700} noWrap>
                {user?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap mb={1}>
                {user?.email}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  label={user?.role || "Student"}
                  size="small"
                  color={user?.role === "Admin" ? "error" : "primary"}
                  icon={<BadgeIcon />}
                  sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                />
                {joinedDate && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarTodayIcon
                      sx={{ fontSize: 12, color: "text.disabled" }}
                    />
                    <Typography variant="caption" color="text.disabled">
                      Joined {joinedDate}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {selectedFile && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSaveImage}
                  disabled={savingImage}
                  sx={{ mt: 1.5 }}
                >
                  {savingImage ? "Saving..." : "Save Photo"}
                </Button>
              )}
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Tabs: Profile | Password */}
        <Tabs
          value={profileTab}
          onChange={(_, v) => setProfileTab(v)}
          sx={{
            px: 2,
            "& .MuiTabs-indicator": { borderRadius: 2, height: 3 },
          }}
        >
          <Tab label="Profile" />
          <Tab label="Password" />
        </Tabs>

        <Divider />

        {/* Profile tab */}
        <Fade in={profileTab === 0}>
          <Box sx={{ display: profileTab === 0 ? "block" : "none", p: 4 }}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Email"
                value={user?.email || ""}
                fullWidth
                size="small"
                disabled
                helperText="Email cannot be changed"
              />
              {user?.studentId && (
                <TextField
                  label="Student ID"
                  value={user.studentId}
                  fullWidth
                  size="small"
                  disabled
                />
              )}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={savingProfile || name.trim() === (user?.name || "")}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Fade>

        {/* Password tab */}
        <Fade in={profileTab === 1}>
          <Box sx={{ display: profileTab === 1 ? "block" : "none", p: 4 }}>
            <Stack spacing={2.5}>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                size="small"
              />
              <Divider />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                size="small"
                error={
                  confirmPassword.length > 0 && newPassword !== confirmPassword
                }
                helperText={
                  confirmPassword.length > 0 && newPassword !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleChangePassword}
                  disabled={
                    savingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                >
                  {savingPassword ? "Changing..." : "Change Password"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
}
