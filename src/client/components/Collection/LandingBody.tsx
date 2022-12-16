import {
  Container,
  createStyles,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "src/utils/trpc";
import { Loading, LoadingBreadcrumb } from "../Common/Loading";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useInView } from "react-intersection-observer";
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

export const CollectionBody: React.FC = () => {
  const router = useRouter();
  const { ref: inRef, inView } = useInView();

  const { classes } = useStyles();

  const {
    data: collection,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.collection.getBySlug.useInfiniteQuery({
    slug: router.query.slug as string,
    limit: 10,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 2000,
  });
  React.useEffect(() => {
    fetchNextPage();
  }, [inView]);

  return (
    <Container my="md">
      {status === "loading" ? <LoadingBreadcrumb /> : (
        <>
          <Group position="apart">
            <Group>
              {status === "success" && collection?.pages.length > 0 &&
                  collection?.pages[0]?.collection.emoji
                ? (
                  <Emoji
                    unified={collection?.pages[0]?.collection.emoji}
                    size={32}
                    emojiStyle={EmojiStyle.APPLE}
                  />
                )
                : null}
              <Title weight="bold" color="dimmed">
                {status === "success" && collection?.pages.length > 0
                  ? collection?.pages[0]?.collection.name
                  : "Untitled"}
              </Title>
            </Group>
          </Group>
          {status === "success" && collection?.pages.length > 0 && (
            <Text color="dimmed" size="sm">
              {collection?.pages[0]?.collection.description}
            </Text>
          )}
        </>
      )}
      <div className={classes.linkContainer}>
        {status === "loading" ? <Loading /> : null}
        {status === "error" ? <Text>Error</Text> : null}
        {status === "success"
          ? (
            <div>
              {collection?.pages.map((page) => (
                <div key={page.nextCursor}>
                  {page.links.map((link) => (
                    <PreviewCard
                      hideActions={true}
                      key={link.id}
                      {...link}
                      onMove={() => {}}
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
    </Container>
  );
};
