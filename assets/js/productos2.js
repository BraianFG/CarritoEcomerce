export
    class Productos {
    constructor(id, nombre, precio, cantidad, subtotal) {
        this.id = id,
            this.nombre = nombre,
            this.precio = precio,
            this.cantidad = cantidad || 1,
            this.subtotal = subtotal || 0
    }
    sumarCantidad() {
        this.cantidad = this.cantidad++;
    }
}
