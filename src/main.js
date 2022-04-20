const $ = require('jquery');

function Main(child){
    return $(document.body).html(child)
}

module.exports = {Main}