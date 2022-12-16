import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React from "react";
import { trpc } from "src/utils/trpc";
const R_URL =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function CreateLink({ setHidden }: {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm({
    initialValues: {
      url: "",
    },
    validate: {
      url: (value) => R_URL.test(value)  ? null : "Invalid URL",
    },
  });

  const client = trpc.useContext();

  const {
    mutate: createLink,
    isLoading,
  } = trpc.link.create.useMutation({
    onSuccess: () => {
      client.collection.invalidate();
      client.link.invalidate();
      setHidden(false);
    },
    onError: (err) => {
      showNotification({
        title: "Error",
        color: "red",
        message: err.message,
      });
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => createLink(values))}
    >
      <TextInput
        placeholder="Paste link"
        style={{ width: "100%" }}
        {...form.getInputProps("url")}
        required
      />
      <Group position="right">
        <Button
          my="md"
          color="teal"
          type="submit"
          loading={isLoading}
        >
          Save Link
        </Button>
      </Group>
    </form>
  );
}
