// ============================================
// UTILS.JS - Utilidades Generales
// ============================================

// Sistema de Notificaciones Toast
class NotificationSystem {
    constructor() {
        this.createContainer();
    }

    createContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto-remover
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error', 5000);
    }

    warning(message) {
        this.show(message, 'warning', 4000);
    }

    info(message) {
        this.show(message, 'info');
    }
}

const notify = new NotificationSystem();

// Sistema de Loading
let loadingOverlay = null;

function showLoading(text = 'Cargando...', subtext = '') {
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text"></div>
                <div class="loading-subtext"></div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    loadingOverlay.querySelector('.loading-text').textContent = text;
    loadingOverlay.querySelector('.loading-subtext').textContent = subtext;

    setTimeout(() => loadingOverlay.classList.add('show'), 10);
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}

// Calcular precio final con descuento
function calcularPrecioFinal(libro) {
    if (!libro.descuento || libro.descuento === 0) {
        return libro.precio;
    }
    return libro.precio - (libro.precio * libro.descuento / 100);
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Formatear fecha corta
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generar factura (simulado)
function generarFactura(compra) {
    const usuario = db.getById('usuarios', compra.clienteId);
    const libro = db.getById('libros', compra.libroId);

    return {
        numero: compra.id.substring(0, 8).toUpperCase(),
        fecha: formatDate(compra.fechaCompra),
        cliente: {
            nombre: usuario.nombre,
            email: usuario.email,
            rfc: usuario.datosFacturacion.rfc || 'N/A',
            direccion: usuario.datosFacturacion.direccion || 'N/A'
        },
        libro: {
            titulo: libro.titulo,
            precio: libro.precio
        },
        total: compra.precio
    };
}

// Crear notificación en sistema
function crearNotificacion(usuarioId, tipo, mensaje) {
    const notificacion = {
        id: db.generateId(),
        usuarioId: usuarioId,
        tipo: tipo, // 'compra', 'manuscrito_aprobado', 'manuscrito_rechazado', 'solicitud_procesada'
        mensaje: mensaje,
        leida: false,
        fecha: new Date().toISOString()
    };

    db.create('notificaciones', notificacion);
}

// Obtener notificaciones no leídas
function getNotificacionesNoLeidas(usuarioId) {
    const notificaciones = db.getAll('notificaciones');
    return notificaciones.filter(n => n.usuarioId === usuarioId && !n.leida);
}

// Marcar notificación como leída
function marcarNotificacionLeida(notificacionId) {
    db.update('notificaciones', notificacionId, { leida: true });
}

// Mostrar modal
function showModal(title, content, onConfirm = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                ${onConfirm ? '<button class="btn btn-primary" id="modal-confirm">Confirmar</button>' : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    if (onConfirm) {
        document.getElementById('modal-confirm').addEventListener('click', () => {
            onConfirm();
            modal.remove();
        });
    }

    setTimeout(() => modal.classList.add('show'), 10);
}

// Confirmar acción
function confirm(message, onConfirm) {
    showModal('Confirmar', `<p>${message}</p>`, onConfirm);
}

// Truncar texto
function truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Debounce para búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Paginación
class Paginator {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }

    getPage(page) {
        this.currentPage = Math.max(1, Math.min(page, this.totalPages));
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }

    next() {
        return this.getPage(this.currentPage + 1);
    }

    prev() {
        return this.getPage(this.currentPage - 1);
    }

    hasNext() {
        return this.currentPage < this.totalPages;
    }

    hasPrev() {
        return this.currentPage > 1;
    }
}
