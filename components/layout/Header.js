import React, { useContext } from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'
import { css } from '@emotion/core'

import Buscar from '../ui/Buscar'
import Navegacion from './Navegacion'
import Button from '../ui/Boton'
import { FirebaseContext } from '../../firebase'
import firebaseConfig from '../../firebase/config'

const HeaderContainer = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
    }
`

const Logo = styled.p`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`

const Header = () => {

    const { usuario, firebase } = useContext(FirebaseContext)

    return (
        <header
            css={css`
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
                `}
        >
            <HeaderContainer>
                <div
                    css={css`
                    display: flex;
                    align-items: center;
                `}
                >
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>

                    <Buscar />

                    <Navegacion />
                </div>

                <div
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    {usuario ? (
                        <>
                            <p
                                css={css`
                        margin-right: 2rem;
                    `}
                            >Hola: {usuario.displayName}</p>
                            <Button
                                bgColor="true"
                                onClick={() => firebase.cerrarSesion()}
                            >Cerrar Sesión</Button>
                        </>
                    ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        bgColor="true"
                                    >Login</Button>
                                </Link>
                                <Link href="/crear-cuenta">
                                    <Button>Crear Cuenta</Button>
                                </Link>
                            </>
                        )}
                </div>
            </HeaderContainer>
        </header>

    )
}

export default Header
