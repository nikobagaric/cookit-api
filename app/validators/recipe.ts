import vine from '@vinejs/vine'

export const storeRecipeRequestValidator = vine.compile(
    vine.object({
        title: vine.string(),
        description: vine.string(),
        cuisine: vine.string(),
        type: vine.string(),
        difficulty: vine.number(),
        cookingTime: vine.number(),
        ingredients: vine.string(),
        imageUrl: vine.string().optional().nullable()
    })
)

export const updateRecipeRequestValidator = vine.compile(
    vine.object({
        title: vine.string().optional(),
        description: vine.string().optional(),
        cuisine: vine.string().optional(),
        type: vine.string().optional(),
        difficulty: vine.number().optional(),
        cookingTime: vine.number().optional(),
        ingredients: vine.string().optional(),
        imageUrl: vine.string().optional().nullable()
    })
)