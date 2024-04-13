import { TestDoingSelectorProps } from "../types/props";
import { Box, Stack } from "@mui/material";
import ChoiceCard from "./ChoiceCard";
import { Sentence } from "../types/backend";
import { memo } from "react";

function TestDoingSelector({
  getQuestionRes,
  getQuestionAnswerRes,
  firstTranslation,
  selectedIdxes,
  setSelectedIdxes,
  isSubmitted,
}: TestDoingSelectorProps) {
  const GenerateOnClickChoiceCard = (idx: number) => () => {
    // 1つの問題に付き1回限りの回答とするため、回答済の場合はNOP
    if (isSubmitted) return;

    let updated: number[];
    if (getQuestionRes.isMultiplied) {
      const updatedSelectedIdxes: number[] = selectedIdxes.includes(idx)
        ? selectedIdxes.filter((selectedIdx: number) => selectedIdx !== idx)
        : [...selectedIdxes, idx];
      updated = updatedSelectedIdxes.sort((a, b) =>
        a === b ? 0 : a < b ? -1 : 1
      );
    } else {
      updated = [idx];
    }
    setSelectedIdxes(updated);
  };

  return (
    <Box
      width="100%"
      height="40%"
      bottom={0}
      p={2}
      position="absolute"
      style={{ overflowY: "auto" }}
    >
      <Stack spacing={2}>
        {getQuestionRes.choices.length > 0 ? (
          getQuestionRes.choices.map((choice: Sentence, idx: number) => (
            <ChoiceCard
              key={idx}
              isSelected={selectedIdxes.includes(idx)}
              isCorrect={
                getQuestionAnswerRes.correctIdxes.length > 0 &&
                selectedIdxes.includes(idx) &&
                getQuestionAnswerRes.correctIdxes.includes(idx)
              }
              isIncorrect={
                getQuestionAnswerRes.correctIdxes.length > 0 &&
                selectedIdxes.includes(idx) &&
                !getQuestionAnswerRes.correctIdxes.includes(idx)
              }
              isMissed={
                getQuestionAnswerRes.correctIdxes.length > 0 &&
                !selectedIdxes.includes(idx) &&
                getQuestionAnswerRes.correctIdxes.includes(idx)
              }
              choice={choice}
              translatedText={
                firstTranslation.choices.length > 0
                  ? firstTranslation.choices[idx]
                  : undefined
              }
              onClick={GenerateOnClickChoiceCard(idx)}
            />
          ))
        ) : (
          <>
            <ChoiceCard />
            <ChoiceCard />
          </>
        )}
      </Stack>
    </Box>
  );
}

export default memo(TestDoingSelector);
