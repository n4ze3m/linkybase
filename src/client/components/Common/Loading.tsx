import { Group, Skeleton } from "@mantine/core";
import React from "react";

export const Loading: React.FC = () => {
  return (
    <>
      <Skeleton height={92} radius="sm" mb="md" />
      <Skeleton height={92} radius="sm" mb="md" />
      <Skeleton height={92} radius="sm" mb="md" />
      <Skeleton height={92} radius="sm" mb="md" />
    </>
  );
};

export const LoadingBreadcrumb: React.FC = () => {
  return (
    <Group>
      <Skeleton height={32}  width={22} />
      <Skeleton height={32} width={120} />
    </Group>
  );
};
