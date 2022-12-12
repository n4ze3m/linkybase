import { TRPCError } from "@trpc/server"
import { Context } from "../context"
import { createCollectionType } from "../schema/collection.schema"

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

