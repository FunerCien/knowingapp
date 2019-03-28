import { Table } from '../components/utilities/enums/Tables';

export module Entities {

    export class Synchronization {
        edition: String;
        entity: Table;
        entities: any[];
        ids: Number[];
        constructor(synchronization?: Synchronization) {
            this.edition = synchronization && synchronization.edition || null;
            this.entity = synchronization && synchronization.entity || null;
            this.entities = synchronization && synchronization.entities || [];
            this.ids = synchronization && synchronization.ids || [];
        }
    }

    export class Option {
        id: Number;
        action: String;
        module: String;
        update: String;
        profiles: Profile[];
        constructor(option?: Option) {
            this.id = option && option.id || null;
            this.action = option && option.action || null;
            this.module = option && option.module || null;
            this.profiles = option && option.profiles || [];
            this.toString = () => {
                let name: String;
                if (this.action === "CREATE") name = "Crear "
                else if (this.action === "READ") name = "Consultar "
                else if (this.action === "UPDATE") name = "Actualizar "
                else if (this.action === "DELETE") name = "Eliminar "
                else name = "¿?";
                if (this.module === "OPTIONS") name += "opciones"
                else if (this.module === "PROFILES") name += "perfiles"
                else if (this.module === "PERMITS") name += "permisos"
                else name += "¿?";
                return name.toString();
            };
        }
    }
    export class Profile {
        id: Number;
        title: String;
        update: String;
        options: Option[];
        constructor(profile?: Profile) {
            this.id = profile && profile.id || null;
            this.title = profile && profile.title || null;
            this.update = profile && profile.update || null;
            this.options = profile && profile.options || [];
            this.toString = () => this.title.toString();
        }
    }
}