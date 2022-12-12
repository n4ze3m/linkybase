import { object, string, TypeOf } from "zod"

export const createCollectionInput = object({
    name: string(),
    emoji: string(),
})

export type createCollectionType = TypeOf<typeof createCollectionInput>