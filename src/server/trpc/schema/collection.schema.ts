import { number, object, string, TypeOf } from "zod"

export const createCollectionInput = object({
    name: string(),
    emoji: string(),
})

export const getCollectionByIdInput = object({
    limit: number().optional(),
    cursor: string().optional(),
    id: string(),
})

export type createCollectionType = TypeOf<typeof createCollectionInput>


export type getCollectionByIdType = TypeOf<typeof getCollectionByIdInput>