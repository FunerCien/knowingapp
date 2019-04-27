export module Entities {

    export class Option {
        id: Number;
        action: string;
        module: string;
        edition: string;
        constructor(option?: Option) {
            this.id = option && option.id || null;
            this.action = option && option.action || null;
            this.module = option && option.module || null;
            this.edition = option && option.edition || null;
            this.toString = () => {
                let name: string;
                if (this.action === "CREATE") name = "Crear "
                else if (this.action === "READ") name = "Consultar "
                else if (this.action === "UPDATE") name = "Actualizar "
                else if (this.action === "DELETE") name = "Eliminar "
                else name = "¿?";
                if (this.module === "OPTIONS") name += "opciones"
                else if (this.module === "PROFILES") name += "perfiles"
                else if (this.module === "PERMITS") name += "permisos"
                else name += "¿?";
                return name;
            };
        }
    }

    export class Synchronization {
        options: SynchronizationBatch = new SynchronizationBatch();
        constructor(synchronization?: Synchronization) {
            this.options = synchronization && synchronization.options || new SynchronizationBatch();
        }
    }

    export class SynchronizationBatch {
        edition: string;
        synchronizations: any[];
        existings: Number[];
        constructor(synchronization?: SynchronizationBatch) {
            this.edition = synchronization && synchronization.edition || "1999-12-31 00:00:00";
            this.synchronizations = synchronization && synchronization.synchronizations || [];
            this.existings = synchronization && synchronization.existings || [];
        }
    }
}