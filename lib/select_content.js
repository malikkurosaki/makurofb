const { PrismaClient } = require('@prisma/client')
const cLog = require('c-log')
const prisma = new PrismaClient()
const { Select } = require('enquirer')

async function SelectContent() {
    const content = await prisma.contents.findMany({
        include: {
            image: true
        }
    })
    const selectContent = await new Select({
        name: 'content',
        message: 'Pilih Content Yang Ingin Di Lihat',
        choices: content.map(content => ({
            name: content.id,
            message: content.title
        }))
    }).run().catch(err => null);

    if (selectContent == null) {
        console.log('byee ...'.green)
        process.exit();
    }

    const targetContent = content.find(content => content.id === selectContent);
    return targetContent;
}

module.exports = { SelectContent };