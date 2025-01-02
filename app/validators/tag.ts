import vine from '@vinejs/vine'

export const tagValidator = vine.compile(
    vine.object({
        name: vine.string().unique(async (query, field) => {
            const tag = await query.from('tags').where('name', field).first()
            return !tag
          })
    })
)