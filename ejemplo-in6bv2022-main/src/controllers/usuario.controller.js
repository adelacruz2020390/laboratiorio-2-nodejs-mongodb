const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function Registrar(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if(parametros.nombre && parametros.apellido && parametros.email
        && parametros.password) {
            Usuario.find({ email : parametros.email }, (err, usuarioEncontrados) => {
                if ( usuarioEncontrados.length > 0 ){ 
                    return res.status(500)
                        .send({ mensaje: "Este correo ya se encuentra utilizado" })
                } else {
                    modeloUsuario.nombre = parametros.nombre;
                    modeloUsuario.apellido = parametros.apellido;
                    modeloUsuario.email = parametros.email;
                    modeloUsuario.rol = 'ROL_ALUMNO';
                    modeloUsuario.imagen = null;

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        modeloUsuario.password = passwordEncriptada;

                        modeloUsuario.save((err, usuarioGuardado)=>{
                            if(err) return res.status(500)
                                .send({ mensaje : 'Error en la peticion' })
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al guardar el Usuario' })
    
                            return res.status(200).send({ usuario: usuarioGuardado})
                        })
                    })                    
                }
            })
    } else {
        return res.status(404)
            .send({ mensaje : 'Debe ingresar los parametros obligatorios'})
    }

}

function Login(req, res) {
    var parametros = req.body;
    // BUSCAMOS EL CORREO
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (usuarioEncontrado){
            // COMPARAMOS CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contrasena no coincide.'})
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'El usuario, no se ha podido identificar'})
        }
    })
}

function editarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    // BORRAR LA PROPIEDAD DE PASSWORD EN EL BODY
    delete parametros.password;
    delete parametros.rol;

    if( req.user.sub !== idUser ) {
        return res.status(500).send({ mensaje: 'No tiene los permisos para editar este Usuario.' });
    }

    Usuario.findByIdAndUpdate(req.user.sub, parametros, {new: true}, (err, usuarioEditado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuarioEditado) return res.status(500).send({mensaje: 'Error al editar el Usuario'});

        return res.status(200).send({ usuario: usuarioEditado });
    })
}

function EliminarUsuario(req, res) {
    var idUsua = req.params.idUsuario;

    if( req.user.sub !== idUsua ) {
        return res.status(500).send({ mensaje: 'No tiene los permisos para eliminar este Usuario.' });
    }

    Usuario.findByIdAndDelete(req.user.sub, (err, UsuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!UsuarioEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el producto' })

        return res.status(200).send({ usuario: UsuarioEliminado });
    })
}

var maestroAuto = {
    nombre: 'maestro',
    apellido: 'informatica',
    email: 'maestro112@gmail.com',
    password: '123456',
    rol: 'ROL_MAESTRO',
    imagen: 'null'
}

function RegistrarMaestroAutomatico(req, res) {

    var modeloUsuario = new Usuario();
  
    Usuario.find({ email: maestroAuto.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length > 0) {
        return res.status(500)
          .send({ mensaje: "Este correo ya se encuentra utilizado." });
      } else {
          if(maestroAuto.nombre && maestroAuto.apellido && maestroAuto.email
              && maestroAuto.password) {
              modeloUsuario.nombre = maestroAuto.nombre;
              modeloUsuario.apellido = maestroAuto.apellido;
              modeloUsuario.email = maestroAuto.email;
              modeloUsuario.rol = maestroAuto.rol;
              modeloUsuario.imagen = maestroAuto.imagen;
  
              bcrypt.hash(maestroAuto.password, null, null, (err, passwordEncriptada) => {
                  modeloUsuario.password = passwordEncriptada;
  
                  modeloUsuario.save((err, usuarioGuardado) => {
                      if (err) return res.status(500).send({ mensaje: 'Error en la peticion'})
                      if (!usuarioGuardado) return res.status(500)
                          .send({ mensaje: 'Error al registrar usuario'});
                      
                      return res.status(200).send({ usuario: usuarioGuardado });
                  });
              })
              
          } else {
              return res.status(500)
                  .send({ mensaje: "Debe ingresar los parametros obligatorios"});
          }
      }
    });
  }

  function RegistrarMaestro(req, res) {
var parametros = req.body;
    var modeloUsuario = new Usuario();
  
    Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length > 0) {
        return res.status(500)
          .send({ mensaje: "Este correo ya se encuentra utilizado." });
      } else {
          if(parametros.nombre && parametros.apellido && parametros.email
            && parametros.password) {
              modeloUsuario.nombre = parametros.nombre;
              modeloUsuario.apellido = parametros.apellido;
              modeloUsuario.email = parametros.email;
              modeloUsuario.rol = ' ROL_MAESTRO';
              modeloUsuario.imagen = null;
  
              bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                  modeloUsuario.password = passwordEncriptada;
  
                  modeloUsuario.save((err, usuarioGuardado) => {
                      if (err) return res.status(500).send({ mensaje: 'Error en la peticion'})
                      if (!usuarioGuardado) return res.status(500)
                          .send({ mensaje: 'Error al registrar usuario'});
                      
                      return res.status(200).send({ usuario: usuarioGuardado });
                  });
              })
              
          } else {
              return res.status(500)
                  .send({ mensaje: "Debe ingresar los parametros obligatorios"});
          }
      }
    });
  }

  function RegistrarAlumno(req, res) {
    var parametros = req.body;
        var modeloUsuario = new Usuario();
      
        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
          if (usuarioEncontrado.length > 0) {
            return res.status(500)
              .send({ mensaje: "Este correo ya se encuentra utilizado." });
          } else {
              if(parametros.nombre && parametros.apellido && parametros.email
                && parametros.password) {
                  modeloUsuario.nombre = parametros.nombre;
                  modeloUsuario.apellido = parametros.apellido;
                  modeloUsuario.email = parametros.email;
                  modeloUsuario.rol = 'ROL_ALUMNO';
                  modeloUsuario.imagen = null;
      
                  bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                      modeloUsuario.password = passwordEncriptada;
      
                      modeloUsuario.save((err, usuarioGuardado) => {
                          if (err) return res.status(500).send({ mensaje: 'Error en la peticion'})
                          if (!usuarioGuardado) return res.status(500)
                              .send({ mensaje: 'Error al registrar usuario'});
                          
                          return res.status(200).send({ usuario: usuarioGuardado });
                      });
                  })
                  
              } else {
                  return res.status(500)
                      .send({ mensaje: "Debe ingresar los parametros obligatorios"});
              }
          }
        });
      }
    


// BUSQUEDAS

function BusquedaNombre(req, res) {
    var nomUser = req.params.nombreUsuario;

    Usuario.find({ nombre: nomUser }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreRegex(req, res) {
    var nomUser = req.params.nombreUsuario;

    Usuario.find({ nombre: { $regex: nomUser, $options: "i" } }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreRegexBody(req, res) {
    var parametros = req.body;

    Usuario.find({ nombre: { $regex: parametros.nombre, $options: "i" } }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreOApellido(req, res) {
    var parametros = req.body;

    Usuario.find({ $or: [
        { nombre: { $regex: parametros.nombre, $options: "i" } },
        { apellido: { $regex: parametros.apellido, $options: "i" } }
    ] }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuariosEncontrados) return res.status(500)
            .send({ mensaje: 'Error al obtener los usuarios'})

        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function BusquedaNombreYApellido(req, res) {
    var parametros = req.body;

    Usuario.find({ nombre: parametros.nombre, apellido: parametros.apellido }, 
        { nombre: 1 }, (err, usuariosEncontrados) => {
            if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
            if(!usuariosEncontrados) return res.status(500)
                .send({ mensaje: 'Error al obtener los usuarios'})

            return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

module.exports = {
    Registrar,
    Login,
    editarUsuario,
    BusquedaNombre,
    BusquedaNombreRegex,
    BusquedaNombreRegexBody,
    BusquedaNombreOApellido,
    BusquedaNombreYApellido,
    EliminarUsuario,
    RegistrarMaestroAutomatico,
    RegistrarMaestro,
    RegistrarAlumno
}