// ============================================
// AUTH.JS - Sistema de Autenticación
// ============================================

class Auth {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    // Cargar sesión desde localStorage
    loadSession() {
        const sessionData = localStorage.getItem('lumen_session');
        if (sessionData) {
            this.currentUser = JSON.parse(sessionData);
        }
    }

    // Guardar sesión
    saveSession(user) {
        this.currentUser = user;
        localStorage.setItem('lumen_session', JSON.stringify(user));
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem('lumen_session');
        window.location.href = 'login.html';
    }

    // Registrar nuevo usuario
    register(nombre, email, password) {
        // Validar que el email no exista
        const usuarios = db.getAll('usuarios');
        const existe = usuarios.find(u => u.email === email);

        if (existe) {
            return { success: false, message: 'Este email ya está registrado' };
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            password: db.hashPassword(password),
            rol: 'cliente',
            fechaRegistro: new Date().toISOString(),
            estado: 'activo',
            datosFacturacion: {}
        };

        const usuario = db.create('usuarios', nuevoUsuario);

        // Iniciar sesión automáticamente
        this.saveSession(usuario);

        return { success: true, usuario: usuario };
    }

    // Iniciar sesión
    login(email, password) {
        const usuarios = db.getAll('usuarios');
        const usuario = usuarios.find(u =>
            u.email === email && u.password === db.hashPassword(password)
        );

        if (!usuario) {
            return { success: false, message: 'Email o contraseña incorrectos' };
        }

        if (usuario.estado === 'bloqueado') {
            return { success: false, message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' };
        }

        this.saveSession(usuario);
        return { success: true, usuario: usuario };
    }

    // Verificar si está logueado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Verificar rol
    hasRole(rol) {
        if (!this.currentUser) return false;
        if (Array.isArray(rol)) {
            return rol.includes(this.currentUser.rol);
        }
        return this.currentUser.rol === rol;
    }

    // Requiere autenticación (usar en páginas protegidas)
    requireAuth(rolesPermitidos = null) {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }

        if (rolesPermitidos && !this.hasRole(rolesPermitidos)) {
            window.location.href = 'index.html';
            return false;
        }

        return true;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Actualizar datos del usuario actual
    updateCurrentUser(updates) {
        if (!this.currentUser) return false;

        const updated = db.update('usuarios', this.currentUser.id, updates);
        if (updated) {
            this.saveSession(updated);
            return true;
        }
        return false;
    }

    // Redireccionar según rol
    redirectToDashboard() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        switch (this.currentUser.rol) {
            case 'admin':
                window.location.href = 'dashboard-admin.html';
                break;
            case 'moderador':
                window.location.href = 'dashboard-moderador.html';
                break;
            case 'autor':
                window.location.href = 'dashboard-autor.html';
                break;
            case 'cliente':
                window.location.href = 'catalogo.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }
}

// Instancia global
const auth = new Auth();

// Actualizar header según usuario logueado
function updateHeader() {
    const navElement = document.querySelector('.nav');
    if (!navElement) return;

    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();

        // Crear menú según rol
        let menuItems = `
            <a href="index.html" class="nav-link">Inicio</a>
            <a href="catalogo.html" class="nav-link">Catálogo</a>
        `;

        if (user.rol === 'admin') {
            menuItems += `<a href="dashboard-admin.html" class="nav-link">Panel Admin</a>`;
        } else if (user.rol === 'moderador') {
            menuItems += `<a href="dashboard-moderador.html" class="nav-link">Moderación</a>`;
        } else if (user.rol === 'autor') {
            menuItems += `<a href="dashboard-autor.html" class="nav-link">Mis Obras</a>`;
        } else if (user.rol === 'cliente') {
            menuItems += `<a href="mis-libros.html" class="nav-link">Mis Libros</a>`;
        }

        menuItems += `
            <a href="perfil.html" class="nav-link">${user.nombre}</a>
            <button class="nav-link nav-button" onclick="auth.logout()">
                <span>Salir</span>
            </button>
        `;

        navElement.innerHTML = menuItems;
    } else {
        navElement.innerHTML = `
            <a href="index.html" class="nav-link">Inicio</a>
            <a href="catalogo.html" class="nav-link">Catálogo</a>
            <a href="login.html" class="nav-link nav-button">
                <span>Iniciar Sesión</span>
            </a>
        `;
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', updateHeader);
