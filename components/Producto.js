import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!){
        eliminarProducto(id: $id)
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            existencia
            precio
        }
    }
`;

const Producto = ( {producto} ) => {

    const { nombre, precio, existencia, id } = producto;

    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache){
            const  { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter( productoActual => productoActual.id !== id)
                }
            })
        }
    });

    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: '¿Desea eliminar este producto?',
            text: "Esta accion no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!'
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProducto,
                        'success'
                    ) 
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    const editarProducto = () => {
        Router.push({
            pathname: "/editarproducto/[id]",
            query: { id }
        })
    }

    return ( 
        <tr>
        <td className='border px-4 py-2'>{nombre}</td>
        <td className='border px-4 py-2'>{existencia} Unidades</td>
        <td className='border px-4 py-2'>$ {precio}</td>
        <td className='border px-4 py-2'>
            <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold" onClick={() => confirmarEliminarProducto()}>
                Eliminar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>  
            </button>
        </td>
        <td className='border px-4 py-2'>
            <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold" onClick={() => editarProducto()}>
                Editar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
            </button>
        </td>
    </tr>
    );
}
 
export default Producto;