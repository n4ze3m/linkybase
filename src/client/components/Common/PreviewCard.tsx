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
import { IconArrowAutofitRight, IconLink, IconTrash } from "@tabler/icons";
import { trpc } from "src/utils/trpc";
import { Link } from "@prisma/client";

function getDomain(url: string) {
  const domain = url
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")
    .split(/[/?#]/)[0];
  return domain;
}

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
    width: 130,
  },

  mousePointer: {
    cursor: "pointer",
  },
}));

interface PreviewCardProps extends Link {
  onMove: () => void;
  hideActions?: boolean;
}

export const PreviewCard = (data: PreviewCardProps) => {
  const { classes } = useStyles();
  const { hovered, ref } = useHover();

  const client = trpc.useContext();

  const {
    mutate: deleteLink,
    isLoading: isDeleting,
  } = trpc.link.delete.useMutation({
    onSuccess: () => {
      client.link.invalidate();
      client.collection.invalidate();
    },
  });

  return (
    <Card
      p={0}
      mb="md"
      shadow="sm"
      radius="md"
      withBorder={true}
      className={classes.mousePointer}
      ref={ref}
      onDoubleClick={() => {
        if (window !== undefined) {
          window.open(data.url, "_blank")?.focus();
        }
      }}
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
            {data.title || "No title"}
          </Text>

          <Text
            size="xs"
            lineClamp={1}
          >
            {data.description || "No description"}
          </Text>
          <Text size="xs" color="dimmed">
            {getDomain(data.url)}
          </Text>
        </div>
        <Card.Section>
          <Image
            src={data.image}
            height={100}
            width={150}
            alt={data.title || "No title"}
            withPlaceholder
          />
        </Card.Section>
      </Group>
      <Paper
        className={classes.overlayMenu}
        hidden={!hovered || data.hideActions}
      >
        <Group>
          <ActionIcon
            onClick={() => {
              if (window !== undefined) {
                window.open(data.url, "_blank")?.focus();
              }
            }}
          >
            <IconLink />
          </ActionIcon>

          <ActionIcon
            onClick={data.onMove}
          >
            <IconArrowAutofitRight />
          </ActionIcon>
          <ActionIcon
            color="red"
            loading={isDeleting}
            onClick={() => {
              deleteLink({
                id: data.id,
              });
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Paper>
    </Card>
  );
};
