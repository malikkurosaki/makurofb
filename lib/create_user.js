const {PrismaClient} = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const {Select, Form} = require('enquirer');

async function CreateUser(){
    const form = await new Form({
        name: 'user',
        message: 'Tambah User Baru',
        choices: [
            {
                name: 'name',
                message: 'Nama User'
            },
            {
                name: 'email',
                message: 'Email User'
            },
            {
                name: 'password',
                message: 'Password User'
            }
        ]
    }).run().catch(err => console.log("err"));

    if (form == null) {
        console.log('byee ...'.green)
        return;
    }

    if (form.name == null || form.email == null || form.password == null) {
        console.log('isi semuanya jangan ada yang kosong ...'.green)
        return;
    }

    const user = await prisma.users.create({
        data: {
            name: form.name,
            email: form.email,
            password: form.password
        }
    });
    user['password'] = "********";
    cLog.table([user]);
}

module.exports = {CreateUser};