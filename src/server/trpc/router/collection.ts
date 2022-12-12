import { createCollectionController, getUserCollectionsController } from "../controller/collection";
import { createCollectionInput } from "../schema/collection.schema";
import { publicProcedure, router } from "../trpc";

export const collectionRouter = router({
    create: publicProcedure.input(createCollectionInput).mutation(createCollectionController),
    getAll: publicProcedure.query(getUserCollectionsController)
})