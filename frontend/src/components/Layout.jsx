import { Box, Container, Typography, Stack, Divider } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 3,
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", sm: "center" }}
          spacing={2}
        >
          <Typography variant="body2" color="text.disabled">
            © {year} UniSport. All rights reserved.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            divider={
              <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
            }
          >
            {[
              { label: "Facilities", to: "/facilities" },
              { label: "My Bookings", to: "/my-bookings" },
              { label: "Profile", to: "/profile" },
            ].map(({ label, to }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    "&:hover": { color: "primary.main" },
                    transition: "color 0.2s",
                  }}
                >
                  {label}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function Layout() {
  return (
    <Box
      minHeight="100vh"
      bgcolor="background.default"
      display="flex"
      flexDirection="column"
    >
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
