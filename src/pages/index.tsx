import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import SourceIcon from "@mui/icons-material/Source";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { GetTests, Test } from "@/types/backend";
import { accessBackend } from "@/services/backend";
import { useAccount, useMsal } from "@azure/msal-react";
import { Skeleton } from "@mui/material";

function Home() {
  const [opens, setOpens] = useState<boolean[]>([]);
  const [getTestsRes, setGetTestsRes] = useState<GetTests>({});

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  const handleClick = (i: number) => {
    const updatedOpens = [...opens];
    updatedOpens[i] = !updatedOpens[i];
    setOpens(updatedOpens);
  };

  // クライアントサイドでの初回レンダリング時のみ[GET] /testsを実行
  useEffect(() => {
    (async () => {
      const res: GetTests = await accessBackend<GetTests>(
        "GET",
        "/tests",
        instance,
        accountInfo
      );

      setOpens(new Array(Object.keys(res).length).fill(false));
      setGetTestsRes(res);
    })();
  }, [accountInfo, instance]);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} component="nav">
      {Object.keys(getTestsRes).length > 0 ? (
        Object.keys(getTestsRes).map((course: string, i: number) => (
          <React.Fragment key={course}>
            <ListItemButton
              onClick={() => handleClick(i)}
              sx={{ height: "60px" }}
              divider
            >
              <ListItemIcon>
                <SourceIcon />
              </ListItemIcon>
              <ListItemText
                primary={course}
                primaryTypographyProps={{ variant: "h6" }}
              />
              {opens[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={opens[i]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {getTestsRes[course].map((test: Test) => (
                  <ListItemButton key={test.id} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary={test.testName} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))
      ) : (
        <Skeleton variant="rectangular" width="100%" height="60px" />
      )}
    </List>
  );
}

export default Home;
