import { createLink, getInboxLinks, moveLink, deleteLink } from "../controller/link";
import { paginationInput } from "../schema/common.schema";
import { createLinkInput, moveLinkInput, deleteLinkInput } from "../schema/link.schema";
import { publicProcedure, router } from "../trpc";

export const linkRouter = router({
    getInbox: publicProcedure.input(paginationInput).query(getInboxLinks),
    create: publicProcedure.input(createLinkInput).mutation(createLink),
    move: publicProcedure.input(moveLinkInput).mutation(moveLink),
    delete: publicProcedure.input(deleteLinkInput).mutation(deleteLink)
})