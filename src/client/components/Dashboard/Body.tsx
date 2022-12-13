import { Container, createStyles, Group, Text, Title } from "@mantine/core";
import { IconInbox } from "@tabler/icons";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Loading, LoadingBreadcrumb } from "../Common/Loading";
import { PreviewCard } from "../Common/PreviewCard";
import { useInView } from "react-intersection-observer";
import { MoveModal } from "../Common/MoveModal";
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
  const { ref: inRef, inView } = useInView();

  const {
    data: inbox,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.link.getInbox.useInfiniteQuery({
    limit: 10,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 2000,
  });

  React.useEffect(() => {
    fetchNextPage();
  }, [inView]);

  const [openMoveModal, setOpenMoveModal] = React.useState(false);
  const [linkId, setLinkId] = React.useState("");

  const { classes } = useStyles();
  return (
    <Container my="md">
      {status === "loading" ? <LoadingBreadcrumb /> : (
        <Group>
          <IconInbox size={32} />
          <Title weight="bold" color="dimmed">
            Inbox
          </Title>
        </Group>
      )}
      <div className={classes.linkContainer}>
        {status === "loading" ? <Loading /> : null}
        {status === "error" ? <Text>Error</Text> : null}
        {status === "success"
          ? (
            <div>
              {inbox?.pages.map((page) => (
                <div key={page.nextCursor}>
                  {page.items.map((link) => (
                    <PreviewCard
                      key={link.id}
                      {...link}
                      onMove={() => {
                        setLinkId(link.id);
                        setOpenMoveModal(true);
                      }}
                    />
                  ))}
                </div>
              ))}
              <div ref={inRef}>
                {hasNextPage && isFetchingNextPage && "Loading more..."}
              </div>
            </div>
          )
          : null}
      </div>
      <MoveModal
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        linkId={linkId}
      />
    </Container>
  );
};
