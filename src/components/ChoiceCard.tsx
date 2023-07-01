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
  isCorrect,
  isIncorrect,
  isMissed,
  choice,
  translatedText,
  onClick,
}: ChoiceCardProps) {
  const theme = useTheme();

  const backgroundColor: string | undefined = isCorrect
    ? theme.palette.success.main
    : isIncorrect
    ? theme.palette.error.main
    : isMissed
    ? theme.palette.warning.main
    : isSelected
    ? theme.palette.info.main
    : undefined;
  const textColor: string = isCorrect
    ? theme.palette.success.contrastText
    : isIncorrect
    ? theme.palette.error.contrastText
    : isMissed
    ? theme.palette.warning.contrastText
    : isSelected
    ? theme.palette.info.contrastText
    : theme.palette.text.primary;
  const translatedTextColor: string = isCorrect
    ? theme.palette.success.contrastText
    : isIncorrect
    ? theme.palette.error.contrastText
    : isMissed
    ? theme.palette.warning.contrastText
    : isSelected
    ? theme.palette.info.contrastText
    : theme.palette.text.secondary;

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor,
        transition: "background-color 0.2s",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": { paddingBottom: 2 },
          }}
        >
          <Typography variant="body1" color={textColor} fontWeight="bold">
            {choice ? choice.sentence : <Skeleton />}
          </Typography>
          <Typography
            variant="body2"
            color={translatedTextColor}
            fontWeight="bold"
          >
            {translatedText ? translatedText : <Skeleton />}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default memo(ChoiceCard);
