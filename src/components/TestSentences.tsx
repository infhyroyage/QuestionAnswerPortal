import { Sentence } from "@/types/backend";
import { TestSentencesProps } from "@/types/props";
import { Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { memo } from "react";
import { backdropImageSrcState } from "@/services/atoms";
import { useSetRecoilState } from "recoil";

function TestSentences({ sentences, translatedSentences }: TestSentencesProps) {
  const setBackdropSrc = useSetRecoilState<string>(backdropImageSrcState);

  return (
    <Stack p={2} spacing={2}>
      {sentences.length > 0 ? (
        sentences.map((subject: Sentence, idx: number) =>
          subject.isIndicatedImg ? (
            <Image
              key={idx}
              src={subject.sentence}
              alt={`${idx + 1}th Picture`}
              width={160}
              height={120}
              onClick={() => setBackdropSrc(subject.sentence)}
            />
          ) : (
            <div key={idx}>
              <Typography variant="body1" color="text.primary">
                {subject.sentence || <Skeleton />}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {translatedSentences.length > 0 ? (
                  translatedSentences[idx]
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </div>
          )
        )
      ) : (
        <>
          <div>
            <Typography variant="body1" color="text.primary">
              <Skeleton />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Skeleton />
            </Typography>
          </div>
          <Skeleton variant="rectangular" width={160} height={120} />
        </>
      )}
    </Stack>
  );
}

export default memo(TestSentences);
