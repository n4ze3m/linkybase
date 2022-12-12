import { object, string, TypeOf } from "zod"


export const createLinkInput = object({
    url: string(),
})

export type createLinkType = TypeOf<typeof createLinkInput>