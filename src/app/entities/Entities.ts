export module Entities {
    export class Option {
        lid: Number;
        id: Number;
        action: string;
        module: string;
        edition: string;
        constructor(option?: Option) {
            this.lid = option && option.lid || null;
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
                if (this.module === "PROFILES") name += "perfiles"
                else if (this.module === "SUPERVISIONS") name += "supervisiones"
                else if (this.module === "OPTIONS") name += "opciones"
                else if (this.module === "PERMITS") name += "permisos"
                else name += "¿?";
                return name;
            };
        }
    }
    export class Profile {
        lid: Number;
        id: Number;
        name: string;
        edition: string;
        constructor(profile?: Profile) {
            this.lid = profile && profile.lid || null;
            this.id = profile && profile.id || null;
            this.name = profile && profile.name || null;
            this.edition = profile && profile.edition || null;
            this.toString = () => this.name;
        }
    }
    export class Synchronization {
        options: SynchronizationBatch = new SynchronizationBatch();
        profiles: SynchronizationBatch = new SynchronizationBatch();
        constructor(synchronization?: Synchronization) {
            this.options = synchronization && synchronization.options || new SynchronizationBatch();
            this.profiles = synchronization && synchronization.profiles || new SynchronizationBatch();
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