# CIMA API Gateway Unificado

Este repositorio contiene el **API Gateway / Reverse Proxy** del proyecto CIMA. Actúa como el único punto de entrada para el Frontend, encargándose de enrutar el tráfico hacia los distintos microservicios que componen la arquitectura del sistema.

---

## Arquitectura y Patrón de Diseño

Se implementa el patrón **Backend-For-Frontend (BFF) / API Gateway** utilizando `Express` y `http-proxy-middleware`. 

**¿Por qué utilizamos este Gateway?**
1. **Evitar el Monolito Distribuido:** El Frontend en React no necesita conocer las URLs individuales de cada microservicio. Solo se comunica con este Gateway.
2. **Libertad Tecnológica:** Permite que el Módulo de Colaboración es decir la Fase 2 esté en **Node.js** y los Módulos de Marketing/Reportes Fase 3 y 4 estén en **Java**, sin problemas de integración transversal CORS.
3. **Propiedad Compartida:** Este componente le pertenece a ambos grupos de desarrollo.

---

## Reglas de Enrutamiento

El Frontend debe enviar TODAS sus peticiones a este Gateway. El Gateway se encargará de redirigir el tráfico según el prefijo de la URL:

| Prefijo de Ruta | Microservicio Destino | Tecnología | Descripción |
| :--- | :--- | :--- | :--- |
| `/api/v1/core/*` | **Fase 1 (Core/Auth)** | Node.js (Desplegado en la capa gratuita de Render) | Login, gestión de usuarios, roles y proyectos legacy. |
| `/api/v1/collab/*` | **Fase 2 (CIMAxios)** | Node.js | Tablero Kanban, Drag & Drop, Comentarios y S3. |
| `/api/v1/marketing/*`| **Fase 3 y 4 (Mkt/Reportes)** | Java Spring Boot | Campañas, generación de reportes y analítica. |

---

## Contrato de Seguridad (JWT)

La **Fase 1** es la única que manda para la autenticación. 
1. Al hacer login en `/api/v1/core/users/login`, la Fase 1 emite un **JSON Web Token (JWT)**.
2. El Frontend de React debe inyectar este JWT en los headers HTTP bajo la clave `accesstoken` para **todas** las peticiones futuras.
3. El API Gateway deja pasar el token intacto.
4. **Acuerdo entre equipos:** Tanto el microservicio de Node.js (Fase 2) como el de Java (Fase 3/4) deben tener configurada **la misma clave secreta (`JWT_SECRET`)** en sus respectivas variables de entorno para validar la firma del token y autorizar el acceso a sus endpoints.

---

## Nota

Si se requiere cambiar la ruta se puede hacer Pull Request a este repositorio en una nueva rama.

---

## Configuración y Despliegue Local

Para levantar el API Gateway en tu entorno local para desarrollo, sigue estos pasos:

### 1. Clonar e Instalar dependencias
```bash
git clone https://github.com/TU_USUARIO/cima-api-gateway.git
cd cima-api-gateway
npm install

