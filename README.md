# SOC - Sistema de Observaciones Clínicas

SOC es un sistema de gestión de observaciones clínicas basado en el estándar FHIR (Fast Healthcare Interoperability Resources). Este proyecto permite a los usuarios registrar, gestionar y visualizar observaciones clínicas de pacientes de manera eficiente y estandarizada.

## Características

- **Visualizacion de Pacientes**: Muestra una lista con información de pacientes.
- **Registro de Observaciones**: Los usuarios pueden registrar observaciones clínicas utilizando códigos LOINC.
- **Interoperabilidad**: Basado en el estándar FHIR para asegurar la interoperabilidad con otros sistemas de salud.
- **Autenticación y Autorización**: Utiliza NextAuth para la gestión de usuarios y sesiones.
- **Interfaz de Usuario**: Interfaz intuitiva y fácil de usar construida con Next y Tailwind CSS.

## Tecnologías Utilizadas

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Base de Datos**: Postgres
- **Autenticación**: NextAuth
- **Estándar de Interoperabilidad**: FHIR
- **Otros**: @smile-cdr/fhirts, Axios, Joi, zustand, dayjs

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local:

1. Clona el repositorio:

   ```bash
    git clone https://github.com/tu-usuario/soc.git
    cd soc
   ```

2. Instala las dependencias del frontend y backend:

   ```bash
    npm install
   ```

   _Esto instalará tanto el frontend como el backend ingresando automaticamente a cada carpeta y ejecutando npm install_

3. Configura las variables de entorno: Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables:

   ```bash
    # Variables de entorno para el frontend
    API_URL = http://localhost:3000
    NEXTAUTH_URL=http://localhost:5170
    NEXTAUTH_SECRET = your_secret_key_here

    # Variables de entorno para el backend
    *se envian por mail*
   ```

4. Inicia el servidor de desarrollo:

   ```bash
    # Frontend: en una terminal
    npm run frontend

    # Backend: en otra terminal
    npm run backend
   ```

5. Crea un usuario
6. Abre tu navegador y navega a http://localhost:5170 para ver la aplicación en funcionamiento.

## Uso

- **Registro e Inicio de Sesión:** Los usuarios pueden registrarse y acceder al sistema utilizando sus credenciales.
- **Gestión de Pacientes:** Agrega, edita y elimina información de pacientes.
- **Registro de Observaciones:** Registra nuevas observaciones clínicas para los pacientes utilizando códigos LOINC.
- **Visualización de Observaciones:** Visualiza las observaciones registradas para cada paciente.
