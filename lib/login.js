const { MultiSelect, Select } = require('enquirer')
const { PrismaClient } = require('@prisma/client');
const { Launch } = require('./launch');
const prisma = new PrismaClient()
const puppeter = require('puppeteer');
const event = require('events');
const em = new event.EventEmitter();
/**@type {puppeter.Page[]} */
const listPage = [];
const Table = require('cli-table');
const tableUser = new Table();

em.on('login', async (data) => {
   
    let selectPage = await new Select({
        name: "select",
        message: "Select Page",
        choices: listPage
    }).run();

    console.log(selectPage);
})


async function Login() {
    tableUser.push(["apa ini ada dimana ya", "dua"])
    console.log(tableUser.toString());

    const user = await prisma.users.findMany();
    const select = await new MultiSelect({
        name: 'user',
        message: 'Select user',
        choices: user.map(u => ({
            name: u.id,
            message: u.name,
        }))
    }).run();

    let idx = 0;
    for (const u of select) {
        idx += 1;
        let data = user.find(usr => usr.id === u);
        let page = await Launch();
        listPage.push({
            name: idx,
            message: data.name
        });
        
        em.emit('login', data);
        await page.goto('https://mbasic.facebook.com/login/');
        await page.waitForTimeout(2000);
        await page.type("input[name=email]", `${data.email}`);
        await page.type("input[name=pass]", `${data.password}`);
        await page.waitForTimeout(2000);
        await page.click("input[name=login]");
        await page.goto('https://mbasic.facebook.com');
        await page.waitForTimeout(2000);
        let [q] = await page.$x("//input[@name='q']");
        await page.waitForTimeout(2000);
        if(q){
            const cookies = await page.cookies();
            await prisma.cookies.upsert({
                create: {
                    usersId: Number(data.id),
                    value: JSON.stringify(cookies)
                },
                update: {
                    value: JSON.stringify(cookies)
                },
                where: {
                    id: Number(data.id)
                }
            })
        }
    }
}

module.exports = { Login }