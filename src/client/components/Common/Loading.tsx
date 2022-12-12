import { Skeleton } from "@mantine/core";
import React from "react";

export const Loading: React.FC = () => {
  return (
    <>
      <Skeleton height={32} radius="sm" mb="md" />
      <Skeleton height={32} radius="sm" mb="md" />
      <Skeleton height={32} radius="sm" mb="md" />
      <Skeleton height={32} radius="sm" mb="md" />
    </>
  );
};
