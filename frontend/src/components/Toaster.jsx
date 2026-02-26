import { useState, useEffect } from "react";
import { Snackbar, Alert, Stack } from "@mui/material";

const listeners = [];

export const toaster = {
  create({ title, description, type = "info" }) {
    listeners.forEach((fn) => fn({ title, description, type, id: Date.now() }));
  },
};

export default function Toaster() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handler = (notification) => {
      setNotifications((prev) => [...prev, { ...notification, open: true }]);
    };
    listeners.push(handler);
    return () => {
      const i = listeners.indexOf(handler);
      if (i > -1) listeners.splice(i, 1);
    };
  }, []);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const severityMap = {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
  };

  return (
    <Stack
      spacing={1}
      sx={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}
    >
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open={n.open}
          autoHideDuration={5000}
          onClose={() => handleClose(n.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ position: "relative", mt: 1 }}
        >
          <Alert
            severity={severityMap[n.type] || "info"}
            onClose={() => handleClose(n.id)}
            variant="filled"
            sx={{ minWidth: 280 }}
          >
            <strong>{n.title}</strong>
            {n.description && (
              <div style={{ fontSize: "0.875em", marginTop: 2 }}>
                {n.description}
              </div>
            )}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
