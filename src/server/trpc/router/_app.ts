import { router } from "../trpc";
import { collectionRouter } from "./collection";
import { linkRouter } from "./link";

export const appRouter = router({
    collection: collectionRouter,
    link: linkRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
