const puppeter = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Select } = require('enquirer');
const clog = require('c-log');
const Table = require('cli-table');
const colors = require('colors');
const { Page } = require('./select_page');

async function GetGroups() {

    const user = await prisma.users.findMany({
        include: {
            Cookies: true
        }
    });
    const selectUser = await new Select({
        name: 'user',
        message: 'Pilih User Yang Ingin Di Loginkan',
        choices: user.map(user => ({
            name: user.name,
            message: user.name
        }))

    }).run().catch(err => console.log("err"));

    if (selectUser == null) {
        console.log('byee ...'.green)
        return;
    }

    const userLogin = user.find(user => user.name === selectUser);
    if (userLogin.Cookies == null) {
        console.log('byee ... silahkan login dulu'.green)
        return;
    }

    const page = await Page();
    let cookies = JSON.parse(userLogin.Cookies.value);
    await page.setCookie(...cookies);

    console.log(`Selamat Datang ${userLogin.name}`.green);
    await page.goto("https://mbasic.facebook.com/groups/?seemore&refid=27");
    let links = await page.$$eval("a", (link) =>
        link
            .map((e) => {
                return {
                    name: e.innerHTML,
                    href: e
                        .getAttribute("href")
                        .split("https://mbasic.facebook.com/groups/")[1],
                };
            })
            .filter((e) => e.href != undefined)
            .map((e) => {
                return {
                    name: e.name,
                    id: e.href.split("/?refid=27")[0],
                    url: encodeURI(
                        "https://mbasic.facebook.com/groups/" +
                        e.href.split("/?refid=27")[0] +
                        "/?refid=27"
                    ),
                };
            })
    );

    for (const e of links) {
        await prisma.groups.upsert({
            create: {
                name: e.name,
                url: e.url,
                usersId: Number(userLogin.id),
                groupId: e.id
            },
            update: {
                groupId: e.id,
                name: e.name,
                url: e.url
            },
            where: {
                groupId_usersId: {
                    groupId: e.id,
                    usersId: Number(userLogin.id)
                }
            }
        });
    }

    console.log(`Total Group : ${links.length}`.green);
    return links;
}

module.exports = { GetGroups };