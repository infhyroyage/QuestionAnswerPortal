import { NotTranslatedSnackbarProps } from "@/types/props";
import { Alert, Snackbar } from "@mui/material";

function NotTranslatedSnackbar({ open, onClose }: NotTranslatedSnackbarProps) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
        翻訳できませんでした
      </Alert>
    </Snackbar>
  );
}

export default NotTranslatedSnackbar;
