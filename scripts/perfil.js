// 1. CARGAR DATOS (Se ejecuta automáticamente al abrir la página)
async function cargarPerfil() {
    try {
        // Obtenemos el ID del usuario (o usamos el de prueba 'user_001')
        const userId = localStorage.getItem("usuarioId") || 'user_001'; 

        // Hacemos la petición al servidor
        const response = await fetch(`http://localhost:3000/api/usuario/${userId}`);
        
        if (!response.ok) {
            throw new Error("No se pudo encontrar el usuario");
        }

        const usuario = await response.json();

        // ------------------------------------------------------
        // 📸 LÓGICA DE LA FOTO DE PERFIL (NUEVO)
        // ------------------------------------------------------
        const imgElement = document.getElementById('imgPerfil');
        
        if (imgElement) {
            // Leemos el campo foto_perfil de la base de datos
            const rutaFoto = usuario.datos_personales.foto_perfil;

            // Si existe una ruta en la BD, la usamos. Si no, dejamos la genérica.
            if (rutaFoto) {
                imgElement.src = rutaFoto;
            } else {
                // Ruta por defecto si el usuario no tiene foto personalizada
                imgElement.src = "img/Foto.png"; 
            }
        }
        // ------------------------------------------------------

        // Rellenamos el nombre que sale arriba (si existe ese elemento)
        if(document.getElementById('nombreUsuario')) {
            document.getElementById('nombreUsuario').textContent = usuario.datos_personales.nombre;
        }
            
        // Rellenamos los INPUTS del formulario con los datos actuales
        document.getElementById('nombrePerfil').value = usuario.datos_personales.nombre || "";
        document.getElementById('apellidosPerfil').value = usuario.datos_personales.apellidos || "";
        document.getElementById('correoPerfil').value = usuario.datos_personales.email || "";
        
        // Datos físicos (usamos || {} para evitar error si perfil_fisico está vacío)
        const fisico = usuario.datos_personales.perfil_fisico || {};
        document.getElementById('edadPerfil').value = fisico.edad || "";
        document.getElementById('pesoPerfil').value = fisico.peso || "";
        document.getElementById('alturaPerfil').value = fisico.altura || "";
        
        // Rellenamos el Objetivo de Pasos
        const objetivoElem = document.getElementById('objetivoPerfil');
        if(objetivoElem) {
            // Comprobamos si es un input (caja de texto) o un texto normal (span/p)
            if(objetivoElem.tagName === 'INPUT') {
                objetivoElem.value = usuario.actividad_resumen.objetivoPasos || 0;
            } else {
                objetivoElem.textContent = usuario.actividad_resumen.objetivoPasos || 0;
            }
        }

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// 2. GUARDAR DATOS (Al pulsar el botón)
const btnGuardar = document.getElementById('btnGuardar');

if (btnGuardar) {
    btnGuardar.addEventListener('click', async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola
        
        const userId = localStorage.getItem("usuarioId") || 'user_001';

        // Recogemos el valor del objetivo (sea input o texto)
        const objetivoInput = document.getElementById('objetivoPerfil');
        const nuevoObjetivo = objetivoInput.tagName === 'INPUT' ? objetivoInput.value : objetivoInput.textContent;

        // Preparamos el objeto con los datos actualizados para enviar a MongoDB
        const datosActualizados = {
            "datos_personales.nombre": document.getElementById('nombrePerfil').value,
            "datos_personales.apellidos": document.getElementById('apellidosPerfil').value,
            "datos_personales.email": document.getElementById('correoPerfil').value,
            "datos_personales.perfil_fisico.edad": parseInt(document.getElementById('edadPerfil').value),
            "datos_personales.perfil_fisico.peso": parseFloat(document.getElementById('pesoPerfil').value),
            "datos_personales.perfil_fisico.altura": parseFloat(document.getElementById('alturaPerfil').value),
            "actividad_resumen.objetivoPasos": parseInt(nuevoObjetivo)
            // Nota: No enviamos la foto aquí porque eso requeriría un formulario de subida de archivos
        };

        try {
            const response = await fetch(`http://localhost:3000/api/usuario/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                alert("✅ ¡Perfil actualizado correctamente!");
                location.reload(); // Recargamos para ver los cambios
            } else {
                alert("❌ Error al guardar en el servidor.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("❌ No se pudo conectar con el servidor.");
        }
    });
}

// Ejecutar la carga al iniciar
window.onload = cargarPerfil;