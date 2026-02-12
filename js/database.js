// ============================================
// DATABASE.JS - Simulación de Base de Datos
// ============================================

class Database {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        if (!localStorage.getItem('lumen_initialized')) {
            this.initializeDefaultData();
            localStorage.setItem('lumen_initialized', 'true');
        }
        this.initialized = true;
    }

    initializeDefaultData() {
        // Usuarios iniciales
        const usuarios = [
            {
                id: this.generateId(),
                nombre: "Cliente Demo",
                email: "cliente@lumen.com",
                password: this.hashPassword("12345"),
                rol: "cliente",
                fechaRegistro: new Date().toISOString(),
                estado: "activo",
                datosFacturacion: {
                    direccion: "Calle Principal 123",
                    telefono: "555-0100",
                    rfc: "XAXX010101000"
                }
            },
            {
                id: this.generateId(),
                nombre: "Ana Escritora",
                email: "autor@lumen.com",
                password: this.hashPassword("12345"),
                rol: "autor",
                fechaRegistro: new Date().toISOString(),
                estado: "activo",
                biografia: "Escritora de ficción contemporánea",
                datosFacturacion: {}
            },
            {
                id: this.generateId(),
                nombre: "Carlos Revisor",
                email: "moderador@lumen.com",
                password: this.hashPassword("12345"),
                rol: "moderador",
                fechaRegistro: new Date().toISOString(),
                estado: "activo",
                datosFacturacion: {}
            },
            {
                id: this.generateId(),
                nombre: "Admin Lumen",
                email: "admin@lumen.com",
                password: this.hashPassword("12345"),
                rol: "admin",
                fechaRegistro: new Date().toISOString(),
                estado: "activo",
                datosFacturacion: {}
            }
        ];

        // Categorías iniciales
        const categorias = [
            { id: this.generateId(), nombre: "Ficción", descripcion: "Novelas y cuentos de ficción" },
            { id: this.generateId(), nombre: "Ensayo", descripcion: "Ensayos y textos reflexivos" },
            { id: this.generateId(), nombre: "Poesía", descripcion: "Colecciones de poemas" },
            { id: this.generateId(), nombre: "No Ficción", descripcion: "Biografías, historia, ciencia" },
            { id: this.generateId(), nombre: "Filosofía", descripcion: "Textos filosóficos" }
        ];

        // Libros publicados (obtener ID del autor)
        const autorId = usuarios.find(u => u.email === "autor@lumen.com").id;

        const libros = [
            {
                id: this.generateId(),
                titulo: "La Casa de los Silencios",
                sinopsis: "Una novela intimista que explora los secretos familiares y la memoria. Ana regresa a la casa de su infancia y descubre que lo que callamos puede ser más elocuente que lo que decimos.",
                precio: 299,
                descuento: 0,
                categoria: "Ficción",
                autorId: autorId,
                portada: "../img/libro1.jpg",
                archivoUrl: "#",
                estado: "publicado",
                fechaPublicacion: new Date('2026-01-15').toISOString(),
                ventas: 45
            },
            {
                id: this.generateId(),
                titulo: "Pensar en Tiempos Líquidos",
                sinopsis: "Reflexiones sobre la modernidad, la identidad y el cambio constante. Un ensayo filosófico que examina cómo navegamos en una época donde todo fluye y nada permanece.",
                precio: 249,
                descuento: 15,
                categoria: "Ensayo",
                autorId: autorId,
                portada: "../img/libro2.jpg",
                archivoUrl: "#",
                estado: "publicado",
                fechaPublicacion: new Date('2025-12-01').toISOString(),
                ventas: 32
            },
            {
                id: this.generateId(),
                titulo: "Versos de Luz y Sombra",
                sinopsis: "Una colección de poemas que navegan entre la melancolía y la esperanza. Versos que capturan los claroscuros del alma humana y la belleza de lo efímero.",
                precio: 199,
                descuento: 0,
                categoria: "Poesía",
                autorId: autorId,
                portada: "../img/libro3.jpg",
                archivoUrl: "#",
                estado: "publicado",
                fechaPublicacion: new Date('2025-11-15').toISOString(),
                ventas: 28
            },
            {
                id: this.generateId(),
                titulo: "El Arte de la Observación",
                sinopsis: "Un viaje profundo al poder de mirar con atención. Aprende a ver el mundo con nuevos ojos y descubre la extraordinaria riqueza de lo ordinario.",
                precio: 279,
                descuento: 20,
                categoria: "No Ficción",
                autorId: autorId,
                portada: "../img/libro4.jpg",
                archivoUrl: "#",
                estado: "publicado",
                fechaPublicacion: new Date('2025-10-20').toISOString(),
                ventas: 51
            }
        ];

        // Manuscritos pendientes
        const manuscritos = [
            {
                id: this.generateId(),
                titulo: "Ecos del Pasado",
                sinopsis: "Una novela histórica ambientada en la revolución mexicana.",
                categoria: "Ficción",
                autorId: autorId,
                archivoUrl: "#manuscrito1.pdf",
                estado: "pendiente",
                fechaEnvio: new Date('2026-02-05').toISOString(),
                motivoRechazo: null,
                moderadorId: null
            },
            {
                id: this.generateId(),
                titulo: "Meditaciones Urbanas",
                sinopsis: "Reflexiones sobre la vida en la ciudad contemporánea.",
                categoria: "Ensayo",
                autorId: autorId,
                archivoUrl: "#manuscrito2.pdf",
                estado: "pendiente",
                fechaEnvio: new Date('2026-02-08').toISOString(),
                motivoRechazo: null,
                moderadorId: null
            }
        ];

        // Solicitudes de autor pendientes
        const solicitudesAutor = [
            {
                id: this.generateId(),
                usuarioId: usuarios[0].id, // Cliente Demo
                motivacion: "Siempre he soñado con publicar mis historias y compartirlas con el mundo.",
                experiencia: "He escrito relatos cortos durante 5 años y tengo un manuscrito terminado.",
                estado: "pendiente",
                fechaSolicitud: new Date('2026-02-10').toISOString(),
                moderadorId: null
            }
        ];

        // Guardar en localStorage
        localStorage.setItem('lumen_usuarios', JSON.stringify(usuarios));
        localStorage.setItem('lumen_categorias', JSON.stringify(categorias));
        localStorage.setItem('lumen_libros', JSON.stringify(libros));
        localStorage.setItem('lumen_manuscritos', JSON.stringify(manuscritos));
        localStorage.setItem('lumen_solicitudesAutor', JSON.stringify(solicitudesAutor));
        localStorage.setItem('lumen_compras', JSON.stringify([]));
        localStorage.setItem('lumen_notificaciones', JSON.stringify([]));
    }

    // Utilidades
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    hashPassword(password) {
        // Simulación simple - en producción usar bcrypt
        return btoa(password);
    }

    // CRUD Genérico
    getAll(tabla) {
        const data = localStorage.getItem(`lumen_${tabla}`);
        return data ? JSON.parse(data) : [];
    }

    getById(tabla, id) {
        const items = this.getAll(tabla);
        return items.find(item => item.id === id);
    }

    getByField(tabla, campo, valor) {
        const items = this.getAll(tabla);
        return items.filter(item => item[campo] === valor);
    }

    create(tabla, item) {
        const items = this.getAll(tabla);
        item.id = this.generateId();
        items.push(item);
        localStorage.setItem(`lumen_${tabla}`, JSON.stringify(items));
        return item;
    }

    update(tabla, id, updates) {
        const items = this.getAll(tabla);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            localStorage.setItem(`lumen_${tabla}`, JSON.stringify(items));
            return items[index];
        }
        return null;
    }

    delete(tabla, id) {
        const items = this.getAll(tabla);
        const filtered = items.filter(item => item.id !== id);
        localStorage.setItem(`lumen_${tabla}`, JSON.stringify(filtered));
        return filtered.length < items.length;
    }

    // Métodos específicos para búsquedas comunes
    buscarLibros(query, categoria = null) {
        let libros = this.getAll('libros').filter(l => l.estado === 'publicado');

        if (query) {
            const q = query.toLowerCase();
            libros = libros.filter(libro =>
                libro.titulo.toLowerCase().includes(q) ||
                libro.sinopsis.toLowerCase().includes(q)
            );
        }

        if (categoria) {
            libros = libros.filter(libro => libro.categoria === categoria);
        }

        return libros;
    }

    getLibrosDeAutor(autorId) {
        return this.getAll('libros').filter(l =>
            l.autorId === autorId && l.estado === 'publicado'
        );
    }

    getManuscritosDeAutor(autorId) {
        return this.getAll('manuscritos').filter(m => m.autorId === autorId);
    }

    getComprasDeCliente(clienteId) {
        return this.getAll('compras').filter(c => c.clienteId === clienteId);
    }
}

// Instancia global
const db = new Database();
