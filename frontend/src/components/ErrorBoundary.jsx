import { Component } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minHeight="50vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" fontWeight="bold">
              Something went wrong
            </Typography>
            <Typography color="text.secondary">
              An unexpected error occurred.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
            >
              Go Home
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}
