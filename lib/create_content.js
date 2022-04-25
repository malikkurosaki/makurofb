const { PrismaClient } = require('@prisma/client')
const cLog = require('c-log')
const prisma = new PrismaClient()
const { Select, Form } = require('enquirer')

async function CreateContent() {
    const form = await new Form({
        name: 'content',
        message: 'Tambah Content Baru',
        choices: [
            {
                name: 'name',
                message: 'Nama Content',
                initial: ''
            },
            {
                name: 'description',
                message: 'Deskripsi Content',
                initial: ''
            },
            {
                name: 'price',
                message: 'Harga Content',
                initial: ''
            },
            {
                name: 'image1',
                message: 'Image 1 Content ',
                initial: ''
            },
            {
                name: 'image2',
                message: 'Image 2 Content ',
                initial: ''
            },
            {
                name: 'image3',
                message: 'Image 3 Content ',
                initial: ''
            },
        ]
    }).run().catch(err => console.log("err"));


    if (form == null) {
        console.log('byee ...'.green)
        return;
    }

    if (Object.values(form).includes('')) {
        console.log('isi semuanya jangan ada yang kosong ...'.green)
        return;
    }

    const createContent = await prisma.contents.create({
        data: {
            title: form.name,
            desc: form.description,
            price: Number(form.price),
            image: {
                create: [
                    {
                        url: form.image1
                    },
                    {
                        url: form.image2
                    },
                    {
                        url: form.image3
                    }
                ]
            }
        }
    });

    const contentAll = await prisma.contents.findMany({
        include: {
            image: true
        }
    });
    cLog.table([...contentAll]);

}

module.exports = { CreateContent }