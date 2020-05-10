import React, { useState, useContext } from 'react'
import { css } from '@emotion/core'
import Router, { useRouter } from 'next/router'
import FileUploader from 'react-firebase-file-uploader'
import Layout from '../components/layout/Layout'
import { Form, Div, InputSubmit, Error } from '../components/ui/Formulario'

import { FirebaseContext } from '../firebase'

import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validacion/validarCrearProducto'
import firebaseConfig from '../firebase/config'

import Error404 from '../components/layout/404'

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: '',
}

const NuevoProducto = () => {

    //State de las imagenes
    const [nombreimagen, guardarNombre] = useState('')
    const [subiendo, guardarSubiendo] = useState(false)
    const [progreso, guardarProgreso] = useState(0)
    const [urlimagen, guardarUrlImagen] = useState('')

    const [error, guardarError] = useState(false)


    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

    const { nombre, empresa, imagen, url, descripcion } = valores

    const router = useRouter()

    const { usuario, firebase } = useContext(FirebaseContext)



    async function crearProducto() {

        // Si el usuario no esta autenticado
        if (!usuario) {
            return router.push('/login')
        }

        // Crear el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        // Insertarlo en la base de datos
        firebase.db.collection('productos').add(producto)

        return router.push('/')
    }

    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleProgress = progreso => guardarProgreso({ progreso });

    const handleUploadError = error => {
        guardarSubiendo(error);
        console.error(error);
    };

    const handleUploadSuccess = nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombre(nombre)
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                guardarUrlImagen(url);
            });
    };


    return (
        <div>
            <Layout>
                {!usuario ? <Error404 /> : (

                    <>
                        <h1
                            css={css`
                            text-align: center;
                            margin-top: 5rem; 
                        `}
                        >Nuevo Producto</h1>
                        <Form
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <fieldset>
                                <legend>Información General</legend>
                                <Div>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Nombre del producto"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Div>
                                {errores.nombre && <Error>{errores.nombre}</Error>}
                                <Div>
                                    <label htmlFor="empresa">Empresa</label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        placeholder="Tu Empresa"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Div>
                                {errores.empresa && <Error>{errores.empresa}</Error>}

                                <Div>
                                    <label htmlFor="imagen">Imagen</label>
                                    <FileUploader
                                        accept="image/*"
                                        id="imagen"
                                        name="imagen"
                                        randomizeFilename
                                        storageRef={firebase.storage.ref("productos")}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}
                                    />
                                </Div>
                                {errores.imagen && <Error>{errores.imagen}</Error>}

                                <Div>
                                    <label htmlFor="url">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        placeholder="URL de tu producto"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Div>
                                {errores.url && <Error>{errores.url}</Error>}
                            </fieldset>
                            <fieldset>
                                <legend>Sobre tu producto</legend>
                                <Div>
                                    <label htmlFor="descripcion">Descripcion</label>
                                    <textarea

                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Div>
                                {errores.descripcion && <Error>{errores.descripcion}</Error>}
                            </fieldset>


                            {error && <Error>{error}</Error>}
                            <InputSubmit
                                type="submit"
                                value="Crear Producto"
                            />
                        </Form>
                    </>
                )}

            </Layout>

        </div>
    )
}


export default NuevoProducto
