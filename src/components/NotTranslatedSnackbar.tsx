import { NotTranslatedSnackbarProps } from "@/types/props";
import { Alert, Snackbar } from "@mui/material";
import { memo } from "react";

function NotTranslatedSnackbar({ open, onClose }: NotTranslatedSnackbarProps) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity="warning"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        翻訳できませんでした
      </Alert>
    </Snackbar>
  );
}

export default memo(NotTranslatedSnackbar);
