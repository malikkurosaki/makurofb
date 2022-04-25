const puppeteer = require('puppeteer');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { Select } = require('enquirer');
const { Page } = require('./select_page');
const { SelectUser } = require('./select_user');
const Spinner = require('cli-spinner').Spinner;
let spin = new Spinner({ text: '%s' });
spin.setSpinnerString('|/-\\');

/**
 * @param {puppeteer.Page} page 
 * @param {string} postId
 * */
async function SharePostingan() {

    let prop = await SelectUser();
    let user = prop.user;
    let page = prop.page;
    await page.goto(`https://web.facebook.com/groups/318652373671885/yourposts/?availability=available&referral_surface=group_mall_header_nav`);

    /**@type {{
        name: string;
        href: string;
    }[]} */
    let listUrl = await new Promise((resolve, reject) => {
        let batas = 20;
        let cari = setInterval(async () => {
            try {
                let links = await page.$$eval("a", (link) => link.map((e) => ({
                    name: e.textContent,
                    href: e.getAttribute("href")
                })).filter((e) => `${e.href}`.includes(`/marketplace/item/`)));
                if (links.length > 0) {
                    clearInterval(cari);
                    resolve(links);
                }
                if (batas-- == 0) {
                    clearInterval(cari);
                    process.exit(1)
                }
            } catch (error) {
                console.log('error lanjut')
            }
        }, 1000);

    });

    let pilih = await new Select({
        name: 'pilih',
        message: 'Pilih Postingan',
        choices: listUrl.map((e) => ({
            name: e.href,
            message: e.name
        }))
    }).run().catch(err => console.log("err"));

    if (pilih == null) {
        console.log('byee ...'.green)
        process.exit(1);
    }

    let index = listUrl.findIndex((e) => e.href === pilih);
    let tombolShare = await page.$x("//span[contains(text(), 'Tawarkan di Lebih Banyak Tempat')]");
    tombolShare[index].click();

    await page.waitForTimeout(5000);

    const groups = user.Groups.filter(e => user.Shares.find(e2 => e2.groupsGroupId == e.groupId) == null);
    
    /**@type {user.Groups[]} */
    const hasilFilter = await new Promise((resolve, reject) => {
        let cari = setInterval(async () => {
            try {
                let listTargetShare = await page.$x('//span[@style="-webkit-box-orient: vertical; -webkit-line-clamp: 2; display: -webkit-box;"]/span');
                if (listTargetShare) {
                    clearInterval(cari);
                    /**@type {puppeteer.ElementHandle<Element>[]} */
                    
                    let batasan = 20;
                    let listTargetGroup = [];
                    for(let target of listTargetShare){
                        let text = await target.evaluate((e) => e.textContent);
                        let targetgroup = groups.find((e) => e.name.toLowerCase() === text.toLowerCase());
                        if(targetgroup){
                            if(batasan-- > 0){
                                await target.click();
                                await page.waitForTimeout(500);
                                listTargetGroup.push(targetgroup);
                                console.log(`click:  ${targetgroup.name}`.green);
                            }else{
                                resolve(listTargetGroup);
                            }
                        }
                    }

                }
            } catch (error) {
                console.log('error lanjut')
            }
        }, 500);
    });

    for(let group of hasilFilter){
        let share = await prisma.shares.create({
            data: {
                
            }
        });
        console.log(`share: ${share.id}`.green);
    }


}


module.exports = { SharePostingan }