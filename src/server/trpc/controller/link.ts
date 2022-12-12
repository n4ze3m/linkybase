import { TRPCError } from "@trpc/server"
import { Context } from "../context"
import { paginationType } from "../schema/common.schema"


export const getInboxLinks = async (
    {
        ctx,
        input
    }: {
        ctx: Context,
        input: paginationType
    }
) => {

    const { user } = ctx

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to get your collections"
        })
    }

    const inboxLength = await ctx.prisma.link.count({
        where: {
            userId: user.id,
            isInbox: true
        }
    })

    const take = input.take || 10
    const skip = input.skip || 0

    const links = await ctx.prisma.link.findMany({
        where: {
            userId: user.id,
            isInbox: true
        },
        take,
        skip,
        orderBy: {
            sortIndex: "asc"
        }
    })

    return {
        data: links,
        total: inboxLength,
        next: skip + take < inboxLength ? skip + take : null,
    }

}
