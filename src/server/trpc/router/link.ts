import { getInboxLinks } from "../controller/link";
import { paginationInput } from "../schema/common.schema";
import { publicProcedure, router } from "../trpc";

export const linkRouter = router({
    getInbox: publicProcedure.input(paginationInput).query(getInboxLinks)
})