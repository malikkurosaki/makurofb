const {PrismaClient} = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();


async function ShowGroup(){
    const group = await prisma.groups.findMany({
        select: {
            name: true,
        }
    });
    cLog.table([...group]);
}

module.exports = {ShowGroup}