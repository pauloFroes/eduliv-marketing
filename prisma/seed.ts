import { PrismaClient } from '@prisma/client'

import { hashPassword } from '../src/helpers/crypt'
import { getFirstName } from '../src/helpers/text'

const prisma = new PrismaClient()

async function main() {
  const password = await hashPassword('123456')
  const displayName = getFirstName('João Silva Santos')

  const user = await prisma.user.upsert({
    where: { email: 'admin@eduliv.com' },
    update: {},
    create: {
      email: 'admin@eduliv.com',
      fullName: 'João Silva Santos',
      displayName,
      password,
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
