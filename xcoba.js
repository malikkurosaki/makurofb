const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

    ; (async () => {
       const user = await prisma.users.findFirst({
            include: {
                Groups: true,
                Shares: true
            }
        })

        let apa = user.Groups.filter(e => user.Shares.find(e2 => e2.groupsGroupId == e.groupId) == null)
        

    })()

