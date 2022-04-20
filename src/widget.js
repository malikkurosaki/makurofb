const $ = require('jquery');

/**
 * 
 * @param {JQuery<HTMLElement>} widget 
 */
function Con(child){
    const container = $(`<div></div>`)
    container.html(child)
    return container
}

function Btn({onclick: onclick}){
    const btn = $(`<button>Tombol</button>`);
    btn.on('click', onclick)
    return btn
}
function Col({children: children}){
    const col = $(`<div></div>`);
    for(let c of children){
        col.append(c)
    }
    return col
}

function Tx(text){
    const tx = $(`<span>${text}</span>`)
    return tx;
}


module.exports = {
    Con, 
    Btn, 
    Col, 
    Tx
}