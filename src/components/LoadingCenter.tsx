import { Box, CircularProgress } from "@mui/material";

function LoadingCenter() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress size={100} />
    </Box>
  );
}

export default LoadingCenter;
