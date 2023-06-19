import { isShownSystemErrorSnackbarState } from "@/services/atoms";
import { Alert, Snackbar } from "@mui/material";
import { memo } from "react";
import { useRecoilState } from "recoil";

function SystemErrorSnackbar() {
  const [isShownSystemErrorSnackbar, setIsShownSystemErrorSnackbar] =
    useRecoilState<boolean>(isShownSystemErrorSnackbarState);

  const onClose = () =>
    setIsShownSystemErrorSnackbar(!isShownSystemErrorSnackbar);

  return (
    <Snackbar
      open={isShownSystemErrorSnackbar}
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

export default memo(SystemErrorSnackbar);
