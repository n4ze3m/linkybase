import { TRPCError } from "@trpc/server"
import { Context } from "../context"
import { createCollectionType, getCollectionByIdType } from "../schema/collection.schema"

export const createCollectionController = async (
    {
        input,
        ctx
    }: {
        input: createCollectionType
        ctx: Context
    }
) => {
    const user = ctx.user

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to create a collection"
        })
    }


    const collection = await ctx.prisma.collection.create({
        data: {
            ...input,
            userId: user.id
        }
    })


    return collection

}

export const getUserCollectionsController = async (
    {
        ctx
    }: {
        ctx: Context
    }
) => {

    const user = ctx.user

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

    const collections = await ctx.prisma.collection.findMany({
        where: {
            userId: user.id
        }
    })

    return {
        inboxLength,
        collections
    }
}

export const getCollectionsByIdController = async (
    {
        ctx,
        input
    }: {
        ctx: Context,
        input: getCollectionByIdType
    }
) => {

    const user = ctx.user

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to get your collections"
        })
    }

    const collection = await ctx.prisma.collection.findUnique({
        where: {
            id: input.id
        }
    })

    if (!collection) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Collection not found"
        })
    }


    const take = input.limit || 10
    const { cursor } = input;


    const links = await ctx.prisma.link.findMany({
        where: {
            userId: user.id,
            isInbox: false,
            collectionId: collection.id
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
        collection,
        links,
        nextCursor
    }

}

