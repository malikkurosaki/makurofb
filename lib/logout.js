const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { Select } = require('enquirer')
const cLog = require('c-log')


async function Logout() {

    const user = await prisma.users.findMany({
        include: {
            Cookies: true
        }
    });

    const userCek = user.filter(e => e.Cookies != null)
    const selectUser = await new Select({
        name: "delete",
        message: "pilih user yang akan logout",
        choices: [...userCek.map((e) => ({
            name: e.id,
            message: e.name
        }))]
    }).run().catch(e => null)

    if (selectUser == null) {
        console.log('byee .. '.green)
        return;
    }

    const target = await prisma.cookies.delete({
        where: {
            usersId: selectUser
        }
    }).catch(e => null)

    if (target != null) {
        console.log("SUCCESS".cyan)
    }else{
        console.log("gagal")
    }

}

module.exports = { Logout }