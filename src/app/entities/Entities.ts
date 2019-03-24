export module Entities {
    export class Option {
        id: Number;
        action: String;
        category: String;
        profiles: Profile[];
        constructor(option?: Option) {
            this.id = option && option.id || null;
            this.action = option && option.action || null;
            this.category = option && option.category || null;
            this.profiles = option && option.profiles || [];
            this.toString = () => {
                let name: String;
                if (this.action === "CREATE") name = "Crear "
                else if (this.action === "READ") name = "Consultar "
                else if (this.action === "UPDATE") name = "Actualizar "
                else if (this.action === "DELETE") name = "Eliminar "
                else name = "¿?";
                if (this.category === "OPTIONS") name += "opciones"
                else if (this.category === "PROFILES") name += "perfiles"
                else if (this.category === "PERMITS") name += "permisos"
                else name += "¿?";
                return name.toString();
            };
        }
    }
    export class Profile {
        id: Number;
        title: String;
        options: Option[];
        constructor(profile?: Profile) {
            this.id = profile && profile.id || null;
            this.title = profile && profile.title || null;
            this.options = profile && profile.options || [];
            this.toString = () => this.title.toString();
        }
    }
}