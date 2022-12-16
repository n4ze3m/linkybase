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






export type createLinkType = TypeOf<typeof createLinkInput>

export type moveLinkType = TypeOf<typeof moveLinkInput>

export type deleteLinkType = TypeOf<typeof deleteLinkInput>

