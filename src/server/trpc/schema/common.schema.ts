import { object, number, TypeOf } from "zod"

export const paginationInput = object({
    skip: number().optional(),
    take: number().optional(),
})

export type paginationType = TypeOf<typeof paginationInput>