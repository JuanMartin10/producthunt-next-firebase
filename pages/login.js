import React, { useState } from 'react'
import { css } from '@emotion/core'
import Router from 'next/router'
import Layout from '../components/layout/Layout'
import { Form, Div, InputSubmit, Error } from '../components/ui/Formulario'

import firebase from '../firebase'

import useValidacion from '../hooks/useValidacion'
import validarIniciarSesion from '../validacion/validarIniciarSesion'

const STATE_INICIAL = {
    email: '',
    password: '',
}

const Login = () => {

    const [error, guardarError] = useState(false)


    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion)

    const { email, password } = valores

    async function iniciarSesion() {
        try {
            await firebase.login(email, password)
            Router.push('/')
        } catch (error) {
            console.error('Hubo un error al crear el usuario', error.message)
            guardarError(error.message)
        }
    }




    return (
        <div>
            <Layout>
                <>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem; 
                        `}
                    >Iniciar Sesión</h1>
                    <Form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <Div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="Tu Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}

                            />
                        </Div>
                        {errores.email && <Error>{errores.email}</Error>}

                        <Div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="Password"
                                placeholder="Tu password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Div>
                        {errores.password && <Error>{errores.password}</Error>}

                        {error && <Error>{error}</Error>}
                        <InputSubmit
                            type="submit"
                            value="Iniciar Sesión"
                        />
                    </Form>
                </>
            </Layout>

        </div>
    )
}


export default Login
