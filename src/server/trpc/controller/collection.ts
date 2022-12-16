import { TRPCError } from "@trpc/server"
import { Context } from "../context"
import { collectionByIDType, collectionBySlugType, createCollectionType, getCollectionByIdType, updateCollectionType } from "../schema/collection.schema"
import slugify from "slugify"
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
        },
        orderBy: {
            createdAt: "asc"
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

export const updateCollectionController = async (
    {
        ctx,
        input
    }: {
        ctx: Context,
        input: updateCollectionType
    }
) => {
    const user = ctx.user
    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to update a collection"
        })
    }


    const collection = await ctx.prisma.collection.findFirst({
        where: {
            userId: user.id,
            id: input.id
        }
    })

    if (!collection) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Collection not found"
        })
    }

    await ctx.prisma.collection.update({
        where: {
            id: input.id
        },
        data: {
            ...input.values
        }
    })

    return "Collection updated"
}

export const shareCollectionController = async (
    {
        ctx,
        input
    }: {
        ctx: Context,
        input: collectionByIDType
    }
) => {
    const user = ctx.user

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to share a collection"
        })
    }

    const collection = await ctx.prisma.collection.findFirst({
        where: {
            userId: user.id,
            id: input.id
        }
    })

    if (!collection) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Collection not found"
        })
    }


    if (!collection.publicSlug) {
        const slug = slugify(`${collection.name}-${collection.id}`, {
            lower: true,
            strict: true,
        })

        await ctx.prisma.collection.update({
            where: {
                id: input.id
            },
            data: {
                publicSlug: slug
            }
        })
    }


    const toggle = collection.isPublic ? false : true

    await ctx.prisma.collection.update({
        where: {
            id: input.id
        },
        data: {
            isPublic: toggle
        }
    })


    return "Collection shared"

}


export const getCollectionBySlug = async (
    {
        ctx,
        input
    }: {
        ctx: Context,
        input: collectionBySlugType
    }
) => {


    const collection = await ctx.prisma.collection.findFirst({
        where: {
            publicSlug: input.slug,
            isPublic: true
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