import { object, string, TypeOf } from "zod"


export const createLinkInput = object({
    url: string(),
})

export const moveLinkInput = object({
    linkId: string(),
    collectionId: string(),
})

export const deleteLinkInput = object({
    id: string(),
})


export const searchLinkInput = object({
    query: string(),
})


export const searchResult = object({
    title: string().optional(),
    description: string().optional(),
    image: string().optional(),
    url: string().optional(),
    id: string().optional(),
})



export type createLinkType = TypeOf<typeof createLinkInput>

export type moveLinkType = TypeOf<typeof moveLinkInput>

export type deleteLinkType = TypeOf<typeof deleteLinkInput>

export type searchLinkType = TypeOf<typeof searchLinkInput>

export type searchResultType = TypeOf<typeof searchResult>