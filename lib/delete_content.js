const { PrismaClient } = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const { Select } = require('enquirer');

async function DeleteContent() {
    const contents = await prisma.contents.findMany();
    const select = await new Select({
        name: 'content',
        message: 'Pilih Content Yang Ingin Di Hapus',
        choices: [...contents.map(content => ({
            name: content.id,
            message: content.title
        }))]
    }).run().catch(err => console.log("err"));

    if (select == null) {
        console.log('byee ...'.green)
        return;
    }

    const content = await prisma.contents.delete({
        where: {
            id: select
        }
    });

    let contentsAll = await prisma.contents.findMany({
        include: {
            images: true
        }
    });

    cLog.table([...contentsAll]);

}


module.exports = { DeleteContent };