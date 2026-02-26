import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Skeleton,
  Paper,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import api from "../../api/axios";
import { toaster } from "../../components/Toaster";

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
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        fontWeight: 700,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? (c?.darkBg ?? "action.selected")
            : (c?.bg ?? "action.selected"),
        color: c?.color ?? "text.primary",
      }}
    />
  );
}

function FacilityRowSkeleton() {
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box flex={1}>
          <Skeleton width="40%" height={28} sx={{ mb: 1 }} />
          <Stack direction="row" spacing={1} mb={1}>
            <Skeleton
              variant="rounded"
              width={72}
              height={24}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rounded"
              width={72}
              height={24}
              sx={{ borderRadius: 1 }}
            />
          </Stack>
          <Skeleton width="55%" height={18} />
        </Box>
        <Stack direction="row" spacing={1}>
          <Skeleton
            variant="rounded"
            width={100}
            height={32}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rounded"
            width={52}
            height={32}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rounded"
            width={58}
            height={32}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </Box>
    </Paper>
  );
}

const emptyForm = {
  name: "",
  type: "Snooker",
  location: "",
  capacity: "",
  status: "Active",
};

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchFacilities = () => {
    setLoading(true);
    api
      .get("/facilities")
      .then((res) => setFacilities(res.data.facilities))
      .catch(() => setFacilities([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cap = Number(form.capacity);
    if (!cap || cap <= 0) {
      toaster.create({
        title: "Capacity must be a positive number",
        type: "error",
      });
      return;
    }
    setSaving(true);
    try {
      const data = { ...form, capacity: cap };
      if (editingId) {
        await api.put(`/facilities/${editingId}`, data);
        toaster.create({ title: "Facility updated", type: "success" });
      } else {
        await api.post("/facilities", data);
        toaster.create({ title: "Facility created", type: "success" });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchFacilities();
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Failed to save",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (facility) => {
    setForm({
      name: facility.name,
      type: facility.type,
      location: facility.location,
      capacity: String(facility.capacity),
      status: facility.status,
    });
    setEditingId(facility._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?"))
      return;
    try {
      await api.delete(`/facilities/${id}`);
      toaster.create({ title: "Facility deleted", type: "success" });
      fetchFacilities();
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Failed to delete",
        type: "error",
      });
    }
  };

  const handleToggleStatus = async (facility) => {
    const newStatus = facility.status === "Active" ? "Maintenance" : "Active";
    if (!window.confirm(`Change status to ${newStatus}?`)) return;
    try {
      await api.put(`/facilities/${facility._id}`, { status: newStatus });
      toaster.create({
        title: `Status changed to ${newStatus}`,
        type: "success",
      });
      fetchFacilities();
    } catch (err) {
      toaster.create({ title: "Failed to update status", type: "error" });
    }
  };

  if (loading) {
    return (
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Skeleton width={220} height={40} />
          <Skeleton
            variant="rounded"
            width={130}
            height={36}
            sx={{ borderRadius: 1 }}
          />
        </Box>
        <Stack spacing={2}>
          {[...Array(4)].map((_, i) => (
            <FacilityRowSkeleton key={i} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Manage Facilities
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          {showForm ? "Cancel" : "Add Facility"}
        </Button>
      </Box>

      {showForm && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 1.5, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {editingId ? "Edit Facility" : "New Facility"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    label="Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  >
                    {["Snooker", "Football", "Badminton"].map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      )}

      <Stack spacing={2}>
        {facilities.map((facility) => (
          <Paper
            key={facility._id}
            elevation={2}
            sx={{ p: 3, borderRadius: 1.5 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {facility.name}
                </Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  <SportTypeChip type={facility.type} />
                  <Chip
                    label={facility.status}
                    size="small"
                    color={facility.status === "Active" ? "success" : "error"}
                  />
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {facility.location} | Capacity: {facility.capacity}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleToggleStatus(facility)}
                >
                  {facility.status === "Active"
                    ? "Set Maintenance"
                    : "Set Active"}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(facility)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(facility._id)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
