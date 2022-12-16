import { ActionIcon, Button, Group, Menu, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconMoodSmile } from "@tabler/icons";
import EmojiPicker, { Emoji, EmojiStyle, Theme } from "emoji-picker-react";
import React from "react";
import { trpc } from "src/utils/trpc";

export function CreateCollection({ setHidden }: {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm({
    initialValues: {
      name: "",
      emoji: "",
    },
  });

  const client = trpc.useContext();

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const {
    isLoading,
    mutateAsync: createCollection,
  } = trpc.collection.create.useMutation({
    onSuccess: () => {
      client.collection.getAll.invalidate();
      setHidden(true);
    },
    onError: (err) => {
      showNotification({
        title: "Error",
        color: "red",
        message: "Something went wrong",
      });
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values) => createCollection(values))}
    >
      <Group>
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

        <TextInput
          placeholder="Create collection"
          style={{ width: "90%" }}
          {...form.getInputProps("name")}
          required
        />
      </Group>

      <Group position="right">
        <Button
          my="md"
          color="teal"
          loading={isLoading}
          type="submit"
        >
          Save Collection
        </Button>
      </Group>
    </form>
  );
}
