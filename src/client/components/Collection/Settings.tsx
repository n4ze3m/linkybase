import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Modal,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Collection } from "@prisma/client";
import { IconClipboard, IconMoodSmile } from "@tabler/icons";
import EmojiPicker, { Emoji, EmojiStyle, Theme } from "emoji-picker-react";
import React from "react";
import { getBaseUrl, trpc } from "src/utils/trpc";

interface SettingsModalProps extends Collection {
  onClose: () => void;
  open: boolean;
}

export const SettingsModal = (data: SettingsModalProps) => {
  const client = trpc.useContext();

  const {
    mutate: updateCollection,
    isLoading: isUpdatingCollection,
  } = trpc.collection.update.useMutation({
    onSuccess: () => {
      client.invalidate();
    },
    onError: (err) => {
      showNotification({
        title: "Error",
        color: "red",
        message: err.message,
      });
    },
  });

  const {
    mutate: shareCollection,
    isLoading: isSharingCollection,
  } = trpc.collection.share.useMutation({
    onSuccess: () => {
      client.invalidate();
    },
  });

  const form = useForm({
    initialValues: {
      name: data.name,
      emoji: data.emoji,
      description: data.description || "",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [alreadyLoaded, setAlreadyLoaded] = React.useState(false);
  const [switchValue, setSwitchValue] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!alreadyLoaded) {
      form.setValues({
        name: data.name,
        emoji: data.emoji,
        description: data.description || "",
      });
      setSwitchValue(data.isPublic);
      setAlreadyLoaded(true);
    }
  }, [data]);

  return (
    <Modal
      opened={data.open}
      onClose={() => {
        data.onClose();
        setAlreadyLoaded(false);
      }}
      size={600}
      title={`Collection Settings ${isSharingCollection ? "saving..." : ""}`}
    >
      <form
        onSubmit={form.onSubmit((values) =>
          updateCollection({
            id: data.id,
            values: {
              name: values.name || undefined,
              emoji: values.emoji || undefined,
              description: values.description || undefined,
            },
          })
        )}
      >
        <TextInput
          rightSection={
            <Menu
              withArrow
              opened={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
            >
              <Menu.Target>
                <ActionIcon
                  size={22}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {form.values.emoji
                    ? (
                      <Emoji
                        unified={form.values.emoji}
                        emojiStyle={EmojiStyle.APPLE}
                        size={22}
                      />
                    )
                    : <IconMoodSmile size={22} />}
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <EmojiPicker
                  theme={Theme.DARK}
                  onEmojiClick={(emoji) => {
                    form.setFieldValue("emoji", emoji.unified);
                    setShowEmojiPicker(false);
                  }}
                />
              </Menu.Dropdown>
            </Menu>
          }
          style={{ width: "100%" }}
          placeholder="Collection Name"
          {...form.getInputProps("name")}
        />

        <Textarea
          placeholder="Collection Description"
          {...form.getInputProps("description")}
          my="md"
          maxRows={5}
        />

        <Group my="md" position="right">
          <Button color="teal" type="submit" loading={isUpdatingCollection}>
            Save Changes
          </Button>
        </Group>
      </form>

      <Divider />

      <Group position="apart" noWrap spacing="xl" my="md">
        <div>
          <Text>
            Share to Web
          </Text>
          <Text size="xs" color="dimmed">
            Publicly share this collection to anyone with the link.
          </Text>
        </div>
        <Switch
          checked={switchValue}
          onChange={(e) => {
            setSwitchValue(e.currentTarget.checked);
            shareCollection({
              id: data.id,
            });
          }}
          size="lg"
        />
      </Group>

      {data.isPublic && (
        <TextInput
          readOnly
          value={data.publicSlug
            ? `${process.env.NEXT_PUBLIC_HOSTNAME}/p/${data.publicSlug}`
            : ""}
          rightSection={
            <ActionIcon>
              <IconClipboard />
            </ActionIcon>
          }
        />
      )}
    </Modal>
  );
};
