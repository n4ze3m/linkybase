import { TRPCError } from "@trpc/server"
import { Context } from "../context"
import { paginationType } from "../schema/common.schema"
import { createLinkType, deleteLinkType, moveLinkType } from "../schema/link.schema"


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



    const take = input.limit || 10
    const { cursor } = input;


    const links = await ctx.prisma.link.findMany({
        where: {
            userId: user.id,
            isInbox: true
        },
        take: take + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
            sortIndex: "asc"
        },
    })

    let nextCursor: typeof cursor | undefined = undefined;

    if (links.length > take) {
        const nextItem = links.pop()
        nextCursor = nextItem!.id;
    }



    return {
        items: links,
        nextCursor: nextCursor
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


export const moveLink = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: moveLinkType
}) => {

    const { user } = ctx

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to create a link"
        })
    }

    const { linkId, collectionId } = input

    await ctx.prisma.link.updateMany({
        where: {
            userId: user.id,
            isInbox: false,
            collectionId: collectionId
        },
        data: {
            sortIndex: {
                increment: 1
            }
        }
    })

    await ctx.prisma.link.update({
        where: {
            id: linkId
        },
        data: {
            collectionId,
            isInbox: false,
            sortIndex: 1
        }
    })

    return "OK"
}

export const deleteLink = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: deleteLinkType
}) => {
    const user = ctx.user

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to delete a link"
        })
    }

    const { id } = input


    const isExist = await ctx.prisma.link.findUnique({
        where: {
            id
        }
    })

    if (!isExist || isExist.userId !== user.id) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Link not found"
        })
    }

    await ctx.prisma.link.updateMany({
        where: {
            userId: user.id,
            isInbox: isExist.isInbox,
            collectionId: isExist.collectionId,
            sortIndex: {
                gt: isExist.sortIndex
            }
        },
        data: {
            sortIndex: {
                decrement: 1
            }
        }
    })


    await ctx.prisma.link.delete({
        where: {
            id
        }
    })


    return "OK"


}