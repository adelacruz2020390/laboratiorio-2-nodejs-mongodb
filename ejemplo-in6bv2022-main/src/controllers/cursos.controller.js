const Cursos = require('../models/cursos.models');




function EncontrarCursos(req, res) {
    var modeloCursos = new Cursos;
    Cursos.find({}, (err, cursoEncontrado) => {

        console.log(cursoEncontrado + 'asd')
        return res.send({ cursos: cursoEncontrado })
    })
}


function AgregarCursos(req, res) {
    var parametros = req.body;
    var modeloCursos = new Cursos;

    if (parametros.nombre) {
        if (req.user.rol !== 'ROL_ALUMNO') {
            Cursos.find({ nombre: parametros.nombre }, (err, cursoEncontrado) => {
                if (cursoEncontrado.length > 0) {
                    return res.status(500).send({ mensaje: "este curso ya esta registrado" })
                } else {

                    modeloCursos.nombre = parametros.nombre,
                        modeloCursos.descripcion = parametros.descripcion,
                        modeloCursos.idCreadorCurso = req.user.sub

                    modeloCursos.save((err, cursoGuardado) => {
                        return res.send({ cursos: cursoGuardado })
                    });
                }
            })
        } else {
            return res.send({ mensaje: 'no tienes el perm,iso' })
        }
    } else {
        return res.send({ mensaje: 'ingresar paramentros' })
    }
}


function editarCurso(req, res) {
    var idCurs = req.params.idcurso;
    var parametros = req.body;
    /*
        var idCreadorCurso = 
        var parametros = req.body;
    
        if( req.user.sub !== idCurs ) {
            return res.status(500).send({ mensaje: 'No tiene los permisos para editar este curso.' });
        }
    */
    Cursos.findByIdAndUpdate(idCurs, parametros, { new: true }, (err, cursoEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
        if (!cursoEditado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

        return res.status(200).send({ cursos: cursoEditado });
    })
}

function editarcurso1(req, res) {
    var idcurso = req.params.idCurso;
    var parametros = req.body;
    var modeloCursos = new Cursos;



    Cursos.findByIdAndUpdate(idcurso, parametros, { new: true }, (err, cursoEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!cursoEditado) return res.status(404)
            .send({ mensaje: 'Error al Editar el Producto' });

        return res.status(200).send({ Cursos: cursoEditado });

    })




}

function EliminarCurso(req, res) {
    var idcurso = req.params.idCurso;



    Cursos.findByIdAndDelete(idcurso, (err, cursoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!cursoEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el producto' })

        return res.status(200).send({ cursos: cursoEliminado });
    })
}


module.exports = {
    EncontrarCursos,
    AgregarCursos,
    editarCurso, editarcurso1,
    EliminarCurso
}