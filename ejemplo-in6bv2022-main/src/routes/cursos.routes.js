const express = require('express');
const cursosController = require('../controllers/cursos.controller');


const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.get('/encontrarCurso' , cursosController.EncontrarCursos);
api.post('/agregarCurso',md_autenticacion.Auth,cursosController.AgregarCursos);
api.put('/editarcurso/:idCurso',  cursosController.editarcurso1)
api.delete('/Eliminarcurso/:idCurso',cursosController.EliminarCurso)


module.exports = api;