const io = require('socket.io-client/dist/socket.io');
const socket = io("http://localhost:3000")
const $ = require('jquery');
require('bootstrap/dist/css/bootstrap.min.css');

const body = $(document.body);
const user = $('<div>ni adalah user</div>');
const tombolUser = $(`<button>Tambah user</button>`);

body.append(user);
body.append(tombolUser)


tombolUser.on('click', ()=>{
    socket.emit('users', {
        getUsers: true,
        data: 'ini data'
    })
})


socket.on('users', (data) => {
   
   
})

