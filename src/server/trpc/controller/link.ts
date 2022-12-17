import { Link } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import axios from "axios"
import { Context } from "../context"
import { paginationType } from "../schema/common.schema"
import { createLinkType, deleteLinkType, moveLinkType, searchLinkInput, searchLinkType, searchResultType } from "../schema/link.schema"
const R_URL = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/


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

    if (!R_URL.test(input.url)) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid URL"
        })
    }


    const response = await axios.post(process.env.LINKY_SCRAPY_URL!, {
        url: input.url
    })


    const title = response.data.title
    const description = response.data.description
    const image = response.data.image

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


export const searchLink = async ({
    ctx,
    input
}: {
    ctx: Context,
    input: searchLinkType
}) => {
    const user = ctx.user

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to search links"
        })
    }

    const responseTitle = await ctx.supabase.from("Link").select("*").eq("userId", user.id).textSearch("title", input.query, {
        config: "english"
    })

    const responseDescription = await ctx.supabase.from("Link").select("*").eq("userId", user.id).textSearch("description", input.query, {
        config: "english"
    })

    const responseUrl = await ctx.supabase.from("Link").select("*").eq("userId", user.id).textSearch("url", input.query, {
        config: "english"
    })


    const titleData = responseTitle.data || []
    const descriptionData = responseDescription.data || []
    const urlData = responseUrl.data || []

    const searchResult = [...titleData, ...descriptionData, ...urlData].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)

    return searchResult as Link[]

}