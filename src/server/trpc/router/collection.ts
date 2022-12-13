import { createCollectionController, getUserCollectionsController, getCollectionsByIdController } from "../controller/collection";
import { createCollectionInput, getCollectionByIdInput } from "../schema/collection.schema";
import { publicProcedure, router } from "../trpc";

export const collectionRouter = router({
    create: publicProcedure.input(createCollectionInput).mutation(createCollectionController),
    getAll: publicProcedure.query(getUserCollectionsController),
    getById: publicProcedure.input(getCollectionByIdInput).query(getCollectionsByIdController)
})