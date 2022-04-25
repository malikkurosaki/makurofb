const {PrismaClient} = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const {Select} = require('enquirer');

async function Users(){
    const users = await prisma.users.findMany();
    const selectUser = await new Select({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Lihat',
        choices: users.map(user => ({
            name: user.id,
            message: user.name
        }))
    }).run().catch(err => console.log("err"));

    if (selectUser == null) {
        console.log('byee ...'.green)
        return;
    }

    const user = await prisma.users.findUnique({
        include: {
            Cookies: true
        },
        where: {
            id: selectUser
        }
    });

    //user['password'] = "********";
    cLog.table([user]);
}

module.exports = {Users};