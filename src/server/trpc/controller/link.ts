import { TRPCError } from "@trpc/server"
import { Context } from "../context"
import { paginationType } from "../schema/common.schema"
import { createLinkType } from "../schema/link.schema"


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

    const take = input.limit || 10
    const skip = input.cursor || 0

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

    const nextPageCursor = inboxLength - (skip + take) > 0 ? skip + take : null


    return {
        items: links,
        nextCursor: nextPageCursor
    }

}

export const createLink = async (
    {
        ctx,
        input
    }: {
        ctx: Context,
        input: createLinkType
    }
) => {

    const { user } = ctx

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to create a link"
        })
    }


    const title = `Mock title for now ${Math.random()}`
    const description = "Mock description"
    const image = "https://supabase.com/images/og/og-image.jpg"

    const sortIndex = 1
    // update sortIndex of all links in inbox to be +1
    await ctx.prisma.link.updateMany({
        where: {
            userId: user.id,
            isInbox: true
        },
        data: {
            sortIndex: {
                increment: 1
            }
        }
    })

    const link = await ctx.prisma.link.create({
        data: {
            ...input,
            title,
            description,
            image,
            userId: user.id,
            sortIndex,
            isInbox: true
        }
    })

    return link

}