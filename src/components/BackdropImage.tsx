import { backdropImageSrcState } from "@/states/backdropImageSrc";
import { Backdrop } from "@mui/material";
import Image from "next/image";
import { useRecoilState } from "recoil";

function BackdropImage() {
  const [backdropSrc, setBackdropSrc] = useRecoilState<string>(
    backdropImageSrcState
  );

  return (
    <Backdrop
      open={backdropSrc.length > 0}
      onClick={() => setBackdropSrc("")}
      sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
    >
      {backdropSrc.length > 0 && (
        <Image
          src={backdropSrc}
          alt={"Backdrop Picture"}
          fill
          style={{ objectFit: "contain" }}
        />
      )}
    </Backdrop>
  );
}

export default BackdropImage;
