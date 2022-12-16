import {
  ActionIcon,
  Badge,
  createStyles,
  Group,
  Navbar,
  Skeleton,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

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

interface NavbarLoadingProps {
  opened: boolean;
}

export function NavbarLoading(props: NavbarLoadingProps) {
  const { classes } = useStyles();

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!props.opened}
      height={700}
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
    >
      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>
          <Skeleton height={40} radius="sm" />
        </div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <div className={classes.collections}>
          <Skeleton height={40} radius="sm" mb="md" />
          <Skeleton height={50} radius="sm" mb="md" />
          <Skeleton height={60} radius="sm" mb="md" />
          <Skeleton height={60} radius="sm" mb="md" />
        </div>
      </Navbar.Section>
    </Navbar>
  );
}
