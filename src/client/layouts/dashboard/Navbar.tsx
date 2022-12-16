import {
  ActionIcon,
  Badge,
  createStyles,
  Group,
  Modal,
  Navbar,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconFolder, IconInbox, IconPlus } from "@tabler/icons";
import Link from "next/link";
import React from "react";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { trpc } from "src/utils/trpc";
import { NavbarLoading } from "./NavbarLoading";
import { useRouter } from "next/router";
import { CreateCollection } from "./CreateCollection";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  mainLinks: {
    paddingLeft: theme.spacing.md - theme.spacing.xs,
    paddingRight: theme.spacing.md - theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `8px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === "dark"
      ? theme.colors.dark[0]
      : theme.colors.gray[7],

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === "dark"
      ? theme.colors.dark[2]
      : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: 20,
    height: 20,
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: "block",
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === "dark"
      ? theme.colors.dark[0]
      : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
  menuNoBackground: {
    backgroundColor: "transparent",
  },
}));

export function NavbarDashboard() {
  const { classes } = useStyles();

  const [hidden, setHidden] = React.useState(true);
  const router = useRouter();

  const {
    isLoading,
    data: collections,
  } = trpc.collection.getAll.useQuery();

  if (isLoading) {
    return <NavbarLoading />;
  }

  return (
    <Navbar height={700} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>
          <UnstyledButton
            className={classes.mainLink}
            onClick={() =>
              router.push("/dashboard")}
          >
            <div className={classes.mainLinkInner}>
              <IconInbox
                size={20}
                className={classes.mainLinkIcon}
                stroke={1.5}
              />
              <span>
                Inbox
              </span>
            </div>
            <Badge
              size="sm"
              variant="filled"
              className={classes.mainLinkBadge}
            >
              {collections?.inboxLength}
            </Badge>
          </UnstyledButton>
        </div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon
              variant="default"
              size={18}
              onClick={() =>
                setHidden(false)}
            >
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>
          {collections?.collections.map((collection) => (
            <Link
              href={`/dashboard/c/${collection.id}`}
              key={collection.name}
              className={classes.collectionLink}
            >
              <span style={{ marginRight: 9, fontSize: 16 }}>
                {collection.emoji
                  ? (
                    <Emoji
                      unified={collection.emoji}
                      emojiStyle={EmojiStyle.APPLE}
                      size={20}
                    />
                  )
                  : (
                    <IconFolder
                      size={20}
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  )}
              </span>{" "}
              {collection.name}
            </Link>
          ))}
        </div>
      </Navbar.Section>

      <Modal
        opened={!hidden}
        onClose={() =>
          setHidden(true)}
        title="Create collection"
      >
        <CreateCollection setHidden={setHidden} />
      </Modal>
    </Navbar>
  );
}

