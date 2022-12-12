import {
  ActionIcon,
  Card,
  Container,
  createStyles,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconDots, IconInbox, IconLink } from "@tabler/icons";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Loading } from "../Common/Loading";
import { PreviewCard } from "../Common/PreviewCard";

const useStyles = createStyles((theme) => ({
  linkContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  linkBody: {
    paddingLeft: theme.spacing.md,
    width: "80%",
  },
  title: {
    fontWeight: 600,
    lineHeight: 1.2,
  },
}));

export const DashboardBody: React.FC = () => {
  const {
    data: inbox,
    status,
  } = trpc.link.getInbox.useInfiniteQuery({
    limit: 10,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { classes } = useStyles();
  const { hovered, ref } = useHover();
  return (
    <Container my="md">
      <Group>
        <IconInbox size={32} />
        <Title weight="bold" color="dimmed">
          Inbox
        </Title>
      </Group>
      <div className={classes.linkContainer}>
        {status === "loading" ? <Loading /> : null}
        {status === "error" ? <Text>Error</Text> : null}
        {status === "success"
          ? (
            <div>
              {inbox?.pages.map((page) => (
                <div key={page.nextCursor}>
                  {page.items.map((link) => (
                    <PreviewCard key={link.id} {...link} />
                  ))}
                </div>
              ))}
            </div>
          )
          : null}
      </div>
    </Container>
  );
};
