import { object, number, TypeOf } from "zod"

export const paginationInput = object({
    limit: number().optional(),
    cursor: number().optional(),
})

export type paginationType = TypeOf<typeof paginationInput>