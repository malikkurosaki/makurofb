const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
   socket.on('users', async (data)=> {
       console.log(data)
       if(data.getUsers){
            const users = await prisma.users.findMany();
            console.log(users)
            socket.emit('users', {
                getUsers: true,
                data: users
            })
       }
   });
});

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});


