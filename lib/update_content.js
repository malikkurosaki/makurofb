const { PrismaClient } = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const { Select, Form } = require('enquirer');
const eq = require('prompts');

async function UpdateContent() {

    const contents = await prisma.contents.findMany();
    if (contents.length == 0) {
        console.log('tidak ada content yang bisa di update'.red)
        process.exit();
    }
    const select = await new Select({
        name: 'content',
        message: 'Pilih Content Yang Ingin Di Update',
        choices: [...contents.map(content => ({
            name: content.id,
            message: content.title
        }))]
    }).run().catch(err => null);

    const selectcontent = await prisma.contents.findUnique({
        include: {
            image: true
        },
        where: {
            id: select
        }
    });

    const update = await new Form({
        name: 'content',
        message: 'Pilih Content Yang Ingin Di Update',
        choices: [
            {
                name: 'title',
                message: 'judul',
                initial: `${selectcontent.title}`
            },
            {
                type: 'number',
                name: 'price',
                message: 'harga',
                initial: `${selectcontent.price}`
            },
            {
                name: 'desc',
                message: 'keterangan',
                initial: `${selectcontent.desc}`,

            },
            {
                name: 'image1',
                message: 'image1',
                initial: `${selectcontent.image[0].url}`,

            },
            {
                name: 'image2',
                message: 'image2',
                initial: `${selectcontent.image[1].url}`,
            },
            {
                name: 'image3',
                message: 'image3',
                initial: `${selectcontent.image[2].url}`,
            },

        ]
    }).run().catch(err => null);

    if (update == null) {
        console.log('byee ...'.green)
        return;
    }


    let updateContent = await prisma.contents.update({
        where: {
            id: selectcontent.id
        },
        data: {
            title: update.title,
            desc: update.desc,
            price: Number(update.price)
        }
    });


    cLog.table([updateContent]);

}

module.exports = { UpdateContent };