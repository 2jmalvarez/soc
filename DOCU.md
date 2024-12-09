# Desarrollo de la Solución: Sistema de Gestión de Observaciones Clínicas con FHIR

## Descripción General

El sistema desarrollado es una aplicación web que permite gestionar observaciones clínicas (como signos vitales) utilizando el estándar FHIR. Esto garantiza la interoperabilidad de los datos clínicos entre sistemas. La solución incluye un **backend** que gestiona los recursos FHIR y un **frontend** que proporciona una interfaz amigable para visualizar, crear, editar y eliminar observaciones clínicas.

---

## Backend

### 1. Elección de Tecnología

Se optó por **Node.js** con **Express** debido a:

- **Escalabilidad**: Ideal para APIs RESTful con múltiples endpoints.
- **Amplia comunidad**: Gran soporte para estándares como JWT y FHIR.
- **Integración nativa con JSON**: Alineado con el formato de los recursos FHIR.

### 2. Estructura del Proyecto

El backend sigue una arquitectura basada en controladores, servicios y modelos:

- **Controladores**: Manejan las solicitudes HTTP y responden con datos JSON.
- **Servicios**: Implementan la lógica de negocio, como validaciones FHIR.
- **Modelos**: Definen el esquema de la base de datos utilizando **Sequelize** para PostgreSQL.

### 3. Endpoints

Se implementaron los siguientes endpoints:

- **Autenticación**
  - `POST /register`: Crea un nuevo usuario con contraseña cifrada.
  - `POST /login`: Genera un token JWT para el usuario autenticado.
- **Gestión de Pacientes**
  - `GET /patients`: Devuelve la lista de pacientes.
  - `GET /patients/:id`: Devuelve los detalles de un paciente.
- **Gestión de Observaciones**
  - `GET /patients/:id/observations`: Lista las observaciones clínicas del paciente.
  - `POST /patients/:id/observations`: Crea una nueva observación validando el formato FHIR.
  - `PUT /observations/:id`: Actualiza una observación existente.
  - `DELETE /observations/:id`: Elimina una observación clínica.

### 4. Base de Datos

Se utilizó **PostgreSQL** con los siguientes modelos:

- **Usuario**: ID, nombre, email, contraseña (hash bcrypt) y token JWT.
- **Paciente**: ID, nombre, fecha de nacimiento, género, dirección.
- **Observación**: ID, código, valor, fecha, referencia al paciente (ID).

#### Validación FHIR

- Se implementaron reglas para asegurar que los datos cumplen con el estándar FHIR, como:
  - Uso de valores aceptables para códigos de observación (ej., presión arterial, temperatura corporal).
  - Verificación de estructura JSON conforme al esquema FHIR.

### 5. Autenticación y Autorización

- **JWT** se utilizó para autenticar solicitudes.
- Los endpoints protegidos verifican:
  - Si el token es válido.
  - Si el usuario tiene permisos para modificar o eliminar observaciones.

---

## Frontend

### 1. Elección de Tecnología

Se seleccionó **Next.js** (React) por:

- **Renderizado híbrido**: Soporte para SSR/CSR para optimización de carga.
- **Facilidad de integración**: Excelente compatibilidad con APIs RESTful.

### 2. Funcionalidades

- **Login/Registro**: Formulario de autenticación con manejo de errores.
- **Lista de Pacientes**: Muestra pacientes desde el backend.
- **Lista de Observaciones**: Permite explorar las observaciones de un paciente.
- **Formulario de Observaciones**:
  - Creación de nuevas observaciones seleccionando el tipo y valor.
  - Validación de campos obligatorios antes del envío.
- **Edición/Eliminación de Observaciones**: Interfaz para actualizar o borrar datos.

### 3. Validaciones

- Los formularios verifican:
  - Campos obligatorios (nombre, código, valor).
  - Formato válido de fechas y valores (según las reglas FHIR).
- Los mensajes de error claros ayudan al usuario a corregir datos.

---

## Consideraciones Técnicas

### 1. Manejo de Errores

- **Backend**: Respuestas estandarizadas con códigos HTTP (`400`, `401`, `404`, `500`) y mensajes descriptivos.
- **Frontend**: Notificaciones visuales para errores como credenciales incorrectas o validaciones fallidas.

### 2. Seguridad

- Contraseñas cifradas con **bcrypt**.
- Tokens JWT con tiempos de expiración.
- Sanitización de entradas para prevenir inyecciones SQL/XSS.

### 3. Testing

- Pruebas unitarias en backend con **Jest** para:
  - Validación de recursos FHIR.
  - Manejo de JWT.
  - Lógica CRUD de observaciones.
- Pruebas de integración con **Postman** para los endpoints clave.

---

## Documentación

Se creó un archivo `README.md` con:

1. **Instrucciones de configuración**:
   - Instalación de dependencias.
   - Configuración de variables de entorno.
2. **Ejecución del proyecto**:
   - Comandos para levantar el backend y frontend.
   - Ejemplo de ejecución con datos de prueba.
3. **Diseño del sistema**:
   - Diagrama de arquitectura.
   - Justificación de las tecnologías elegidas.

---

## Evaluación y Conclusión

### Criterios Cumplidos

- **Funcionalidad completa**: Todos los endpoints y componentes del frontend implementados.
- **Buenas prácticas**: Código modular, uso de control de versiones (Git), y validaciones robustas.
- **Estándar FHIR**: Validación completa de recursos antes de su almacenamiento.
- **Interfaz amigable**: Diseño minimalista pero funcional.

Este sistema es una base sólida que garantiza interoperabilidad y extensibilidad para futuros desarrollos en el ámbito clínico.
