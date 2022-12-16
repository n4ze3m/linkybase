import { boolean, number, object, string, TypeOf } from "zod"

export const createCollectionInput = object({
    name: string(),
    emoji: string(),
})

export const getCollectionByIdInput = object({
    limit: number().optional(),
    cursor: string().optional(),
    id: string(),
})


export const updateCollectionInput = object({
    id: string(),
    values: object({
        name: string().optional(),
        description: string().optional(),
        emoji: string().optional(),
    })
})

export const collectionByID = object({
    id: string(),
})

export const collectionBySlug = object({
    slug: string(),
    limit: number().optional(),
    cursor: string().optional(),
})


export const deleteCollection = object({
    id: string(),
    deleteLink: boolean().default(false),
})


export type createCollectionType = TypeOf<typeof createCollectionInput>

export type getCollectionByIdType = TypeOf<typeof getCollectionByIdInput>

export type updateCollectionType = TypeOf<typeof updateCollectionInput>

export type collectionByIDType = TypeOf<typeof collectionByID>

export type collectionBySlugType = TypeOf<typeof collectionBySlug>

export type deleteCollectionType = TypeOf<typeof deleteCollection>