const mongoose = require('mongoose');
const app = require('./app');

const url = 'mongodb://localhost:27017/IN6BV'

mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se ha conectado correctamente a la base de datos.');

    app.listen(3000, function (){
        console.log("Servidor de Express corriendo correctamente en el puerto 3000");
    });

}).catch(error => console.log(error));