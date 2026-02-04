# Trazapié - Proyecto Web y App
A continuación se detallan las instrucciones de instalación, el estado actual del desarrollo y las notas importantes para la corrección y funcionamiento.


# 1. Ubicación del código más reciente
Los últimos cambios relacionados con la **Accesibilidad (WCAG y WAI-ARIA)** y mejoras visuales se encuentran en la rama:
**`feature/accesibilidad`**

Asegúrese de cambiar a esta rama para revisar la última versión del código.

# 2. Archivo de entorno (.env)
Por motivos de seguridad, el archivo .env (que contiene la conexión a la base de datos MongoDB Atlas) no está incluido en el repositorio de GitHub.

Ubicación: Podrá encontrar el archivo .env dentro del archivo ZIP que hemos adjuntado en la entrega de la práctica.

# 3. Instrucción de ejecución
El proyecto consta de un Frontend (HTML/SCSS/JS) y un Backend (Node.js). Para que el inicio de sesión funcione correctamente, es necesario arrancar el servidor backend.

Pasos para iniciar el Servidor (Backend):
El archivo de arranque server.js se encuentra dentro de la carpeta back.

1. Abra una terminal en la raíz del proyecto.

2. Navegue a la carpeta del backend:
cd back

3. Instale las dependencias (si es la primera vez):
npm install

4. Inicie el servidor:
node server.js

# 4. Avance Móvil (Flutter)
Hemos incluido en la entrega un video demostrativo (TrazapieMovil.mp4) donde mostramos el progreso actual de la aplicación móvil desarrollada en Flutter. Queremos destacar que la aplicación ya es funcional en entornos reales:

La prueba que se muestra en el video ha sido grabada directamente desde el móvil de Pepe.

En la grabación se puede apreciar que la aplicación funciona perfectamente, carga las pantallas y responde a la interacción en el dispositivo físico.


Para poder conectar a la base de datos añadir esto en un archivo .env en la carpeta back:
MONGO_URI=mongodb+srv://jesus_trazapie:JESsancat2000%2E@cluster0.nc0jutv.mongodb.net/TrazapieDB?appName=Cluster0
