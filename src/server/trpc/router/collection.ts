import { createCollectionController, getUserCollectionsController, getCollectionsByIdController , updateCollectionController, shareCollectionController} from "../controller/collection";
import { createCollectionInput, getCollectionByIdInput,updateCollectionInput, collectionByID } from "../schema/collection.schema";
import { publicProcedure, router } from "../trpc";

export const collectionRouter = router({
    create: publicProcedure.input(createCollectionInput).mutation(createCollectionController),
    getAll: publicProcedure.query(getUserCollectionsController),
    getById: publicProcedure.input(getCollectionByIdInput).query(getCollectionsByIdController),
    update: publicProcedure.input(updateCollectionInput).mutation(updateCollectionController),
    share: publicProcedure.input(collectionByID).mutation(shareCollectionController)
})