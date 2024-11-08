import vine from '@vinejs/vine'

export const storeUserDataValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(30)
      .unique(async (query, field) => {
        const user = await query.from('users').where('username', field).first()
        return !user
      }),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(512)
  })
)

export const updateUserdataValidator = vine.compile(
    vine.object({
        username: vine
      .string()
      .minLength(3)
      .maxLength(30)
      .unique(async (query, field) => {
        const user = await query.from('users').where('username', field).first()
        return !user
      })
      .optional(),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      })
      .optional(),
     points: vine.number().nullable().optional()
    })
)

export const updatePointsValidator = vine.compile(
  vine.object({
    points: vine.number()
  })
)