const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Table = require('cli-table');
const { Form, Select, MultiSelect, BasicAuth, Password } = require('enquirer');
const tableUser = new Table({
    head: ['ID', 'Nama', 'Email', 'Password']
});
const colors = require('colors');


async function ShowUsers  () {
    const users = await prisma.users.findMany();
    tableUser.push(...users.map(item => [
        item.id,
        item.name,
        item.email,
        "********"
    ]));

    console.log(tableUser.toString());
}

async function CreateUser (){
    const form = await new Form({
        showPassword: false,
        name: "user",
        message: "Isilah Data Berikut",
        choices: [
            {
                name: "name",
                message: "Name: "
            },
            {
                name: "email",
                message: "Email: "
            },
            // {
            //     type: "password",
            //     name: "password",
            //     message: "Password: "
            // }
        ]
    }).run();

    const pass = await new Password({
        name: "password",
        message: "Password: "
    }).run();


    if(Object.values(form).includes("") || Object.values(pass).includes("")){
        console.log("Data tidak boleh kosong".red);
        CreateUser()
    }
    form['password'] = pass;
    await prisma.users.create({
        data: {
            ...form
        }
    });
    ShowUsers();
}

async function UpdateUser (){
    const user = await prisma.users.findMany();
    const select = await new Select({
        name: 'user',
        message: 'Select user',
        choices: user.map(u => ({
            name: u.id,
            message: u.name,
        }))
    }).run();

    const form = await new Form({
        name: "user",
        message: "Isilah Data Berikut",
        choices: [
            {
                name: "name",
                message: "Name: ",
                initial: user.find(u => u.id == select).name
            },
            {
                name: "email",
                message: "Email: ",
                initial: user.find(u => u.id == select).email
            },
            {
                name: "password",
                message: "Password: ",
                initial: user.find(u => u.id == select).password
            }
        ]
    }).run();

    if(Object.values(form).includes("")){
        console.log("Data tidak boleh kosong".red);
        UpdateUser()
    }

    await prisma.users.update({
        where: {
            id: Number(select)
        },
        data: {
            ...form
        }
    });
    ShowUsers();
}

async function DeleteUser (){
    const user = await prisma.users.findMany();
    const pilih = await new Select({
        name: "pilih",
        message: "Pilih Untuk Dihapus",
        choices: [...user.map((e) => ({
            name: e.id,
            message: `${e.id} - ${e.name}`
        }))]
    }).run();

    await prisma.users.delete({
        where: {
            id: Number(pilih)
        }
    });

    ShowUsers()
}

async function DeleteMany (){
    const user = await prisma.users.findMany();
    const pilihan = await new MultiSelect({
        name: "deletes",
        message: "Pilih beberapa ",
        choices: [...user.map((e) => ({
            name: e.id,
            message: `${e.id} => ${e.name}`
        }))]
    }).run();

    await prisma.users.deleteMany({
        where: {
            id: {
                in: pilihan
            }
        }
    })

    ShowUsers();
}

module.exports = { ShowUsers, CreateUser, DeleteUser,DeleteMany, UpdateUser }