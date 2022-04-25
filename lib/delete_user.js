const {Select} = require('enquirer');
const {PrismaClient} = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();

async function DeleteUser(){
    const users = await prisma.users.findMany();
    const select = await new Select({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Hapus',
        choices: [...users.map(user => ({
            name: user.id,
            message: user.name
        }))]
    }).run().catch(err => console.log("err"));

    if (select == null) {
        console.log('byee ...'.green)
        return;
    }

    const user = await prisma.users.delete({
        where: {
            id: select
        }
    });

    let usersAll = await prisma.users.findMany();
    usersAll = usersAll.map(user => {
        user['password'] = "********";
        return user;
    });

    cLog.table([...usersAll]);

}

module.exports = {DeleteUser};