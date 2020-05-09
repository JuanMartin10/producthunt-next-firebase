import React, { useState, useEffect } from 'react'



const useValidacion = (initialState, validate, fn) => {

    const [valores, guardarValores] = useState(initialState)
    const [errores, guardarErrores] = useState({})
    const [submitForm, guardarSubmitForm] = useState(false)

    useEffect(() => {
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0

            if (noErrores) {
                fn(); // Fn= Funcion que se ejecuta en el componente
            }

            guardarSubmitForm(false)
        }
    }, [errores])

    // Función que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }

    // Función que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault()
        const erroresValidacion = validate(valores)
        guardarErrores(erroresValidacion)
        guardarSubmitForm(true)
    }

    // Cuando se revisa el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validate(valores)
        guardarErrores(erroresValidacion)
    }

    return {
        valores,
        errores,
        submitForm,
        handleChange,
        handleSubmit,
        handleBlur,
    }
}

export default useValidacion
