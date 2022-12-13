import { object, number, TypeOf, string } from "zod"

export const paginationInput = object({
    limit: number().optional(),
    cursor: string().optional(),
})

export type paginationType = TypeOf<typeof paginationInput>