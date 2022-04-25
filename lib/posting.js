const { PrismaClient } = require('@prisma/client');
const cLog = require('c-log');
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const { CheckLogin } = require('./check_login');
const { SelectContent } = require('./select_content');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { Login } = require('./login');
async function Posting() {
    const groupId = "318652373671885";
    const users = await prisma.users.findMany({
        include: {
            Cookies: true
        }
    })

    if (users.length == 0) {
        console.log("Tidak Ada User, buat terlebi dahulu".red)
        return;
    }

    const userCek = users.filter(e => e.Cookies != null)

    const selectUser = await new Select({
        name: "user",
        message: "Pilih User Yang Ingin Di Lihat",
        choices: [...userCek.map((e) => ({
            name: e.id,
            message: e.name
        }))]
    }).run().catch(e => null)

    if (selectUser == null) {
        console.log('byee .. '.green)
        process.exit(1);
    }

    const targetUser = userCek.find(user => user.id === selectUser);

    const contents = await prisma.contents.findMany({
        include: {
            image: true
        }
    })

    const selectContent = await new Select({
        name: 'content',
        message: 'Pilih Content Yang Ingin Di Lihat',
        choices: contents.map(content => ({
            name: content.id,
            message: content.title
        }))
    }).run().catch(e => null);

    if (selectContent == null) {
        console.log('byee .. '.green)
        process.exit(1);
    }

    const targetContent = contents.find(content => content.id === selectContent);

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=500,720',
            '--lang=id-ID,id'
        ]
    });

    const [page] = await browser.pages();
    page.setViewport({
        width: 500,
        height: 720
    });

    await page.setCookie(...JSON.parse(targetUser.Cookies.value));
    await page.goto('https://mobile.facebook.com/home.php');
    await page.waitForTimeout(2000);

    const url = page.url();
    if (url.includes('login.php')) {
        console.log("belum login".red);
        process.exit(1);
    }

    await page.goto('https://mobile.facebook.com/groups/' + groupId)
    await page.waitForTimeout(2000);

    cLog.table([targetUser])
    cLog.table([targetContent])

    await (await page.waitForSelector('button[title=Jual]')).click();
    await page.waitForTimeout(2000)
    await page.waitForSelector('input[name=composer_attachment_sell_title]')
    await page.type('input[name="composer_attachment_sell_title"]', `${targetContent.title}`);
    await page.type('input[placeholder="Harga"]', `${targetContent.price}`);
    await page.type('input[name="composer_attachment_sell_pickup_note"]', "Denpasar");
    await page.type('textarea', `${targetContent.desc}`);

    let tombolFoto = await page.waitForSelector('button[title="Tambahkan foto ke postingan"]');
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        tombolFoto.click()
    ]);
    let gambar = [];
    gambar = [...targetContent.image.map((e) => e.url.replace(/\'/g, ''))]
    await fileChooser.accept(gambar);
    await page.waitForTimeout(10000);
    await (await page.waitForSelector('button[value="Posting"]')).click();
    await page.waitForTimeout(10000);

    await new Promise((resolve, reject) => {
        let berapa = 0;
        let interval = setInterval(async () => {
            let url = page.url();
            console.log("menunggu success: " + berapa)

            if (url.includes('&id=')) {
                clearInterval(interval);
                resolve(true);
            }
            if (berapa > 20) {
                resolve(false);
                console.log("Gagal Memposting , Pastikan Internet stabil".red)
                process.exit(1)
            }
            berapa++;
        }, 1000);
    })


    await prisma.postings.create({
        data: {
            postingId: new URLSearchParams(page.url()).get('id'),
            contentsId: Number(targetContent.id),
            usersId: Number(targetUser.id)
        }
    })

    console.log('SUCCESS'.green)

    // const selectShare = await new Select({
    //     name: 'share',
    //     message: 'Share Postingan Ini ?',
    //     choices: [
    //         {
    //             name: 'yes',
    //             message: 'Ya'
    //         },
    //         {
    //             name: 'no',
    //             message: 'Tidak'
    //         }
    //     ]
    // }).run().catch(e => null);

    // if (selectShare == null) {
    //     console.log('byee .. '.green)
    //     process.exit(1);
    // }

    // if (selectShare.share == 'yes') {
    //     await page.goto(`https://mobile.facebook.com/groups/${groupId}?view=permalink&id=${createSuccess.postingId}`)
    //     await page.waitForTimeout(2000);
    //     await (await page.waitForSelector('div[aria-label="Tindakan untuk postingan ini"]')).click();
    // }

    process.exit();

    // await page.waitForTimeout(2000);
    // await page.close();



    // await page.goto('https://web.facebook.com/groups/318652373671885/my_posted_content')

    // let postingUrl = page.url();
    // if (postingUrl.includes('my_posted_content')) {
    //     console.log("SUCCESS".green);
    //     process.exit(0);
    // }
    // console.log("GAGAL".red);
    // process.exit(1);


    // https://mobile.facebook.com/groups/318652373671885?view=permalink&id=318848066985649&_rdr
    // https://web.facebook.com/groups/318652373671885/my_posted_content
    // https://web.facebook.com/groups/318652373671885/?multi_permalinks=318848066985649
    // https://mobile.facebook.com/groups/318652373671885?view=permalink&id=318951836975272&_rdr
    // https://m.facebook.com/groups/318652373671885?view=yourposts


}

module.exports = { Posting };