import React from "react";
import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  Image,
  Paper,
  Text,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconArrowAutofitRight,
  IconArrowsTransferDown,
  IconTransferOut,
  IconTrash,
} from "@tabler/icons";

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
  overlayMenu: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    right: 0,
    width: 100,
  },
}));
export const PreviewCard = (data: any) => {
  const { classes } = useStyles();
  const { hovered, ref } = useHover();

  return (
    <Card
      p={0}
      mb="md"
      shadow="sm"
      radius="md"
      withBorder={true}
      ref={ref}
      
    >
      <Group
        noWrap
        spacing={0}
        position="apart"
      >
        <div
          className={classes.linkBody}
        >
          <Text
            size="sm"
            weight={700}
            lineClamp={1}
          >
            {data.title}
          </Text>

          <Text
            size="xs"
            lineClamp={1}
          >
            {data.description}
          </Text>
          <Text size="xs" color="dimmed">
            example.com
          </Text>
        </div>
        <Card.Section>
          <Image
            src={data.image}
            height={100}
            alt={data.title || "No title"}
          />
        </Card.Section>
      </Group>
      <Paper
        className={classes.overlayMenu}
        hidden={!hovered}
      >
        <Group>
          <ActionIcon>
            <IconArrowAutofitRight />
          </ActionIcon>
          <ActionIcon>
            <IconTrash />
          </ActionIcon>
        </Group>
      </Paper>
    </Card>
  );
};
