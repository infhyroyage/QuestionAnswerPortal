import { ExplanationsDialogProps } from "../types/props";
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Ref, forwardRef, memo, useEffect, useState } from "react";
import { PutEn2JaReq, PutEn2JaRes, Sentence } from "../types/backend";
import { useAccount, useMsal } from "@azure/msal-react";
import { accessBackend } from "../services/backend";
import NotTranslatedSnackbar from "./NotTranslatedSnackbar";
import TestSentences from "./TestSentences";
import BackdropImage from "./BackdropImage";
import CloseIcon from "@mui/icons-material/Close";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ExplanationsDialog({
  open,
  onClose,
  choices,
  explanations,
  references,
  secondTranslation,
  setSecondTranslation,
  translatedChoices,
}: ExplanationsDialogProps) {
  const [isShownSnackbar, setIsShownSnackbar] = useState<boolean>(false);

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  // 解説ダイアログを開いた直後のみ解説文・不正解の選択肢の解説文を1度だけ翻訳
  useEffect(() => {
    open &&
      secondTranslation.overall.length === 0 &&
      Object.keys(secondTranslation.incorrectChoices).length === 0 &&
      (async () => {
        // overall、incorrectChoices内のそれぞれの文字列に対して翻訳を複数回行わず、
        // overall、incorrectChoices内の順で配列を作成した文字列に対して翻訳を1回のみ行う
        const data: PutEn2JaReq = [
          ...explanations.overall
            .filter(
              (sentence: Sentence) =>
                !sentence.isEscapedTranslation && !sentence.isIndicatedImg
            )
            .map((sentence: Sentence) => sentence.sentence),
          ...Object.keys(explanations.incorrectChoices).reduce<string[]>(
            (prev: string[], choiceIdx: string) =>
              prev.concat(
                explanations.incorrectChoices[choiceIdx]
                  .filter(
                    (incorrectChoice: Sentence) =>
                      !incorrectChoice.isEscapedTranslation &&
                      !incorrectChoice.isIndicatedImg
                  )
                  .map((incorrectChoice: Sentence) => incorrectChoice.sentence)
              ),
            []
          ),
        ];

        try {
          // [PUT] /en2jpを実行
          const res: PutEn2JaRes = await accessBackend<
            PutEn2JaRes,
            PutEn2JaReq
          >("PUT", "/en2ja", instance, accountInfo, data);

          const overall: string[] = explanations.overall.map(
            (sentence: Sentence) =>
              sentence.isEscapedTranslation || sentence.isIndicatedImg
                ? sentence.sentence
                : (res.shift() as string)
          );
          const incorrectChoices: { [choiceIdx: string]: string[] } =
            Object.keys(explanations.incorrectChoices).reduce(
              (prev: { [choiceIdx: string]: string[] }, choiceIdx: string) => {
                prev[choiceIdx] = explanations.incorrectChoices[choiceIdx].map(
                  (incorrectChoice: Sentence) =>
                    incorrectChoice.isEscapedTranslation ||
                    incorrectChoice.isIndicatedImg
                      ? incorrectChoice.sentence
                      : (res.shift() as string)
                );
                return prev;
              },
              {}
            );
          setSecondTranslation({ overall, incorrectChoices });
        } catch (e) {
          setIsShownSnackbar(true);
        }
      })();
  }, [
    accountInfo,
    explanations,
    instance,
    open,
    secondTranslation,
    setSecondTranslation,
  ]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
    >
      <IconButton
        onClick={onClose}
        size="medium"
        sx={{
          position: "absolute",
          top: (theme) => theme.spacing(1),
          right: (theme) => theme.spacing(1),
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Stack spacing={2} divider={<Divider />}>
          {explanations.overall.length > 0 && (
            <div>
              <Typography variant="h6">解説</Typography>
              <TestSentences
                sentences={explanations.overall}
                translatedSentences={secondTranslation.overall}
              />
            </div>
          )}
          {Object.keys(explanations.incorrectChoices).length > 0 && (
            <div>
              <Typography variant="h6" pb={2}>
                不正解の選択肢
              </Typography>
              <Stack spacing={4}>
                {Object.keys(explanations.incorrectChoices).map(
                  (choiceIdx: string) => (
                    <div key={choiceIdx}>
                      <Card
                        sx={{
                          width: "100%",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <CardContent
                          sx={{
                            padding: 2,
                            "&:last-child": { paddingBottom: 2 },
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight="bold"
                          >
                            {choices[Number(choiceIdx)].sentence}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="bold"
                          >
                            {translatedChoices ? (
                              translatedChoices[Number(choiceIdx)]
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                      <TestSentences
                        sentences={explanations.incorrectChoices[choiceIdx]}
                        translatedSentences={
                          choiceIdx in secondTranslation.incorrectChoices
                            ? secondTranslation.incorrectChoices[choiceIdx]
                            : []
                        }
                      />
                    </div>
                  )
                )}
              </Stack>
            </div>
          )}
          {references.length > 0 && (
            <div>
              <Typography variant="h6">参照</Typography>
              <ul>
                {references.map((reference: string, idx: number) => (
                  <li key={idx}>
                    <Link
                      color="primary"
                      href={reference}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reference}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Stack>
        <BackdropImage />
        <NotTranslatedSnackbar
          open={isShownSnackbar}
          onClose={() => setIsShownSnackbar(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default memo(ExplanationsDialog);
