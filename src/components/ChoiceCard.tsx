import { ChoiceCardProps } from "@/types/props";
import {
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { memo } from "react";

function ChoiceCard({
  isSelected,
  choice,
  translatedText,
  onClick,
}: ChoiceCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: isSelected ? theme.palette.info.light : undefined,
        transition: "background-color 0.2s",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="body1" color={"text.primary"}>
            {choice ? choice.sentence : <Skeleton />}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {choice && !choice.isEscapedTranslation && translatedText ? (
              translatedText
            ) : (
              <Skeleton />
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default memo(ChoiceCard);
