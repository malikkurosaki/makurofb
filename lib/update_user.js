const {PrismaClient} = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const {Select, Form} = require('enquirer');

async function UpdateUser(){
    const users = await prisma.users.findMany();

    const select = await new Select({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Update',
        choices: [...users.map(user => ({
            name: user.id,
            message: user.name
        }))]
    }).run().catch(err => console.log("err"));

    const selectuser = await prisma.users.findFirst({
        where: {
            id: select
        }
    });

    const update = await new Form({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Update',
        choices: [
            {
                name: 'name',
                message: 'Nama User',
                initial: selectuser.name
            },
            {
                name: 'email',
                message: 'Email User',
                initial: selectuser.email
            },
            {
                name: 'password',
                message: 'Password User',
                initial: selectuser.password
            }

        ]
    }).run().catch(err => console.log("err"));

    if (update == null) {
        console.log('byee ...'.green)
        return;
    }
    update['id'] = selectuser.id;
    let updateUser = await prisma.users.update({
        where: {
            id: selectuser.id
        },
        data: {
            name: update.name,
            email: update.email,
            password: update.password
        }
    });

    updateUser['password'] = "********";
    cLog.table([updateUser]);

}

module.exports = {UpdateUser};