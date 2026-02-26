import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import { toaster } from "./Toaster";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  studentOnly = false,
}) {
  const { user, loading } = useAuth();

  const isUnauthorizedAdmin =
    !loading && adminOnly && user && user.role !== "Admin";
  const isUnauthorizedStudent =
    !loading && studentOnly && user && user.role === "Admin";

  useEffect(() => {
    if (isUnauthorizedAdmin) {
      toaster.create({ title: "Access denied. Admins only.", type: "error" });
    }
    if (isUnauthorizedStudent) {
      toaster.create({
        title: "This page is for students only.",
        type: "info",
      });
    }
  }, [isUnauthorizedAdmin, isUnauthorizedStudent]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (isUnauthorizedAdmin) return <Navigate to="/my-bookings" />;
  if (isUnauthorizedStudent) return <Navigate to="/admin/dashboard" />;

  return children;
}
