import {
  createStyles,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import React from "react";
import { trpc } from "src/utils/trpc";

import { Emoji, EmojiStyle } from "emoji-picker-react";
import { IconChevronRight, IconMoodSmile } from "@tabler/icons";
import { Collection } from "@prisma/client";

interface MoveModalProps {
  open: boolean;
  linkId: string;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
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
}));

export const MoveModal = ({ open, onClose, linkId }: MoveModalProps) => {
  const [search, setSearch] = React.useState<Collection[]>([]);
  const { classes } = useStyles();
  const {
    data: collections,
    status,
  } = trpc.collection.getAll.useQuery();

  React.useEffect(() => {
    if (collections) {
      setSearch(collections.collections);
    }
  }, [collections]);

  const client = trpc.useContext();

  const {
    mutate: moveLink,
    isLoading,
  } = trpc.link.move.useMutation({
    onSuccess: () => {
      client.invalidate();
      onClose();
    },
  });

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={isLoading ? "Moving..." : "Move"}
    >
      <TextInput
        disabled={isLoading}
        placeholder="Type a collection name..."
        onChange={(e) => {
          const query = e.currentTarget.value;
          if (query.length > 0) {
            const filtered = collections?.collections.filter((collection) => {
              return collection.name.toLowerCase().includes(
                query.toLowerCase(),
              );
            });
            setSearch(filtered || []);
          } else {
            setSearch(collections?.collections || []);
          }
        }}
      />

      {status === "loading" && "Loading..."}
      <ScrollArea my="md">
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        {search.map((collection) => (
          // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={collection.id}
            className={classes.collectionLink}
            onClick={() => {
              moveLink({
                linkId,
                collectionId: collection.id,
              });
            }}
          >
            <Group position="apart">
              <div>
                <span style={{ marginRight: 9, fontSize: 16 }}>
                  {collection.emoji
                    ? (
                      <Emoji
                        unified={collection.emoji}
                        emojiStyle={EmojiStyle.APPLE}
                        size={22}
                      />
                    )
                    : <IconMoodSmile size={22} />}
                </span>
                {collection.name}
              </div>
              <IconChevronRight
                size={20}
                stroke={1.5}
              />
            </Group>
          </div>
        ))}
      </ScrollArea>
    </Modal>
  );
};
