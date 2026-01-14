// 1. CARGAR DATOS (Se ejecuta al abrir la página)
async function cargarPerfil() {
    try {
        const userId = localStorage.getItem("usuarioId") || 'user_001'; 

        const response = await fetch(`http://localhost:3000/api/usuario/${userId}`);
        if (!response.ok) throw new Error("No se pudo encontrar el usuario");

        const usuario = await response.json();

        // Inyectamos los valores en los INPUTS
        if(document.getElementById('nombreUsuario')) 
            document.getElementById('nombreUsuario').textContent = usuario.datos_personales.nombre;
            
        document.getElementById('nombrePerfil').value = usuario.datos_personales.nombre || "";
        document.getElementById('apellidosPerfil').value = usuario.datos_personales.apellidos || "";
        document.getElementById('correoPerfil').value = usuario.datos_personales.email || "";
        
        // Acceso correcto según tu estructura de MongoDB
        const fisico = usuario.datos_personales.perfil_fisico || {};
        document.getElementById('edadPerfil').value = fisico.edad || "";
        document.getElementById('pesoPerfil').value = fisico.peso || "";
        document.getElementById('alturaPerfil').value = fisico.altura || "";
        
        // CAMBIO: Ahora inyectamos el valor en el INPUT de pasos (asegúrate de que en el HTML sea <input id="objetivoPerfil">)
        const objetivoElem = document.getElementById('objetivoPerfil');
        if(objetivoElem) {
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

// 2. GUARDAR DATOS
const btnGuardar = document.getElementById('btnGuardar');

if (btnGuardar) {
    btnGuardar.addEventListener('click', async (e) => {
        e.preventDefault(); 
        
        const userId = localStorage.getItem("usuarioId") || 'user_001';

        // Recogemos el valor del nuevo objetivo
        const objetivoInput = document.getElementById('objetivoPerfil');
        const nuevoObjetivo = objetivoInput.tagName === 'INPUT' ? objetivoInput.value : objetivoInput.textContent;

        // Estructura actualizada incluyendo objetivoPasos
        const datosActualizados = {
            "datos_personales.nombre": document.getElementById('nombrePerfil').value,
            "datos_personales.apellidos": document.getElementById('apellidosPerfil').value,
            "datos_personales.email": document.getElementById('correoPerfil').value,
            "datos_personales.perfil_fisico.edad": parseInt(document.getElementById('edadPerfil').value),
            "datos_personales.perfil_fisico.peso": parseFloat(document.getElementById('pesoPerfil').value),
            "datos_personales.perfil_fisico.altura": parseFloat(document.getElementById('alturaPerfil').value),
            "actividad_resumen.objetivoPasos": parseInt(nuevoObjetivo) // <--- NUEVA LÍNEA PARA EL OBJETIVO
        };

        try {
            const response = await fetch(`http://localhost:3000/api/usuario/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                alert("✅ ¡Perfil y objetivo actualizados en MongoDB!");
                location.reload(); 
            } else {
                alert("❌ Error al guardar en el servidor.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("❌ No se pudo conectar con el servidor.");
        }
    });
}

window.onload = cargarPerfil;