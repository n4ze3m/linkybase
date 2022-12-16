import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Menu,
  Modal,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconChevronDown,
  IconLogout,
  IconPlus,
  IconSearch,
  IconSettings,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { CreateLink } from "./CreateLink";
import { NavbarDashboard } from "./Navbar";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === "dark"
      ? theme.colors.dark[6]
      : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  userMenu: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === "dark"
      ? theme.colors.dark[8]
      : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tabControl: {
    fontWeight: 500,
    height: 38,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    },
  },

  tabControlActive: {
    borderColor: `${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    } !important`,
  },
}));

type Props = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const [opened, setOpened] = React.useState(false);
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = React.useState(false);
  const [createLink, setCreateLink] = React.useState(false);

  const supabase = useSupabaseClient();

  const user = useUser();

  React.useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user]);

  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        },
      })}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<NavbarDashboard opened={opened} />}
      header={
        <Box>
          <Header height={60} px="md">
            <Group position="apart" sx={{ height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    mr="xl"
                  />
                </MediaQuery>
                <Text
                  weight="bold"
                  size="lg"
                  component={Link}
                  href="/dashboard"
                >
                  LinkYBase
                </Text>
              </div>

              <Group position="right">
                <ActionIcon
                  onClick={() => setCreateLink(true)}
                >
                  <IconPlus />
                </ActionIcon>
                <ActionIcon>
                  <IconSearch />
                </ActionIcon>

                <Menu
                  width={260}
                  transition="pop-top-right"
                  withArrow
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={cx(classes.user, {
                        [classes.userActive]: userMenuOpened,
                      })}
                    >
                      <Group spacing={7}>
                        <Avatar
                          radius="xl"
                          size={30}
                          src={`https://google-avatar-deno.netlify.app/?name=${user?.email}`}
                        />
                        <MediaQuery
                          smallerThan="sm"
                          styles={{ display: "none" }}
                        >
                          <span>
                            {user?.email || "..."}
                          </span>
                        </MediaQuery>
                        <IconChevronDown size={12} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<IconSettings />}
                    >
                      <Link href="/dashboard/settings">
                        Settings
                      </Link>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>
                      Danger Zone
                    </Menu.Label>
                    <Menu.Item
                      color="red"
                      icon={<IconLogout />}
                      onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/auth");
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Header>
        </Box>
      }
    >
      {children}
      <Modal
        opened={createLink}
        onClose={() => setCreateLink(false)}
        title="Create Link"
      >
        <CreateLink setHidden={setCreateLink} />
      </Modal>
    </AppShell>
  );
}

export default DashboardLayout;
