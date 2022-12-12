import { Container, createStyles, Group, Text, Title } from "@mantine/core";
import { IconInbox } from "@tabler/icons";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Loading } from "../Common/Loading";

const useStyles = createStyles((theme) => ({
  linkContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
}));

export const DashboardBody: React.FC = () => {
  const {
    data: inbox,
    status,
  } = trpc.link.getInbox.useQuery({});

  const { classes } = useStyles();

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
              hey
            </div>
          )
          : null}
      </div>
    </Container>
  );
};
