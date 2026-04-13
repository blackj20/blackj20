const express = require('express');
const app =require('./app')


const {PORT,local_url}= process.env

app.listen(PORT, '0.0.0.0',() => {
    console.log(`serveur lanser au port ${PORT} cliquez le lien pour rejoindre ${local_url}:${PORT} ctrl+c pour stoper le serveur`);
}); 

// done!!
