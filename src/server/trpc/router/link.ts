import { createLink, getInboxLinks } from "../controller/link";
import { paginationInput } from "../schema/common.schema";
import { createLinkInput } from "../schema/link.schema";
import { publicProcedure, router } from "../trpc";

export const linkRouter = router({
    getInbox: publicProcedure.input(paginationInput).query(getInboxLinks),
    create: publicProcedure.input(createLinkInput).mutation(createLink),
})