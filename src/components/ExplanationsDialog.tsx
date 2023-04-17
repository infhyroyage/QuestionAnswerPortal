import { ExplanationsDialogProps } from "@/types/props";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Ref, forwardRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { GetEn2Ja, Headers, Sentence } from "@/types/backend";
import Image from "next/image";
import { useAccount, useMsal } from "@azure/msal-react";
import { accessBackend } from "@/services/backend";
import NotTranslatedSnackbar from "./NotTranslatedSnackbar";

const INIT_2ND_TRANSLATION: {
  overall: string[];
  incorrectChoices: { [choiceIdx: string]: string[] };
} = {
  overall: [],
  incorrectChoices: {},
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
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
  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  // 解説ダイアログを開いた直後のみ解説文・不正解の選択肢の解説文を1度だけ翻訳
  useEffect(() => {
    explanations.overall.length > 0 &&
      open &&
      secondTranslation &&
      secondTranslation.overall.length === 0 &&
      (async () => {
        // overall、incorrectChoices内のそれぞれの文字列に対して翻訳を複数回行わず、
        // overall、incorrectChoices内の順で配列を作成した文字列に対して翻訳を1回のみ行う
        const texts: string[] = [
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
          // [GET] /en2jpを実行
          const headers: Headers = {
            texts: JSON.stringify(texts),
          };
          const res: GetEn2Ja = await accessBackend<GetEn2Ja>(
            "GET",
            "/en2ja",
            instance,
            accountInfo,
            headers
          );

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
          setSecondTranslation(undefined);
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
    >
      <DialogTitle>
        解説
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {explanations.overall.map((explanation: Sentence, idx: number) =>
            explanation.isIndicatedImg ? (
              <Image
                key={idx}
                src={explanation.sentence}
                alt={`${idx + 1}th Picture`}
              />
            ) : (
              <span key={idx}>
                <Typography variant="body1" color="text.primary">
                  {explanation.sentence}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {secondTranslation && secondTranslation.overall.length > 0 ? (
                    secondTranslation.overall[idx]
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </span>
            )
          )}
        </Stack>
        {Object.keys(explanations.incorrectChoices).length > 0 && (
          <>
            <Typography variant="h6" pt={5}>
              不正解の選択肢
            </Typography>
            <Stack spacing={4}>
              {Object.keys(explanations.incorrectChoices).map(
                (choiceIdx: string) => (
                  <span key={choiceIdx}>
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
                    <Stack spacing={2}>
                      {explanations.incorrectChoices[choiceIdx].map(
                        (incorrectChoice: Sentence, idx: number) =>
                          incorrectChoice.isIndicatedImg ? (
                            <Image
                              key={idx}
                              src={incorrectChoice.sentence}
                              alt={`${idx + 1}th Picture`}
                            />
                          ) : (
                            <span key={idx}>
                              <Typography variant="body1" color="text.primary">
                                {incorrectChoice.sentence}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {secondTranslation &&
                                secondTranslation.incorrectChoices[choiceIdx]
                                  .length > 0 ? (
                                  secondTranslation.incorrectChoices[choiceIdx][
                                    idx
                                  ]
                                ) : (
                                  <Skeleton />
                                )}
                              </Typography>
                            </span>
                          )
                      )}
                    </Stack>
                  </span>
                )
              )}
            </Stack>
          </>
        )}
        {references.length > 0 && (
          <>
            <Typography variant="h6" pt={5}>
              参照
            </Typography>
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
          </>
        )}
        <NotTranslatedSnackbar
          open={!secondTranslation}
          onClose={() => setSecondTranslation(INIT_2ND_TRANSLATION)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ExplanationsDialog;
