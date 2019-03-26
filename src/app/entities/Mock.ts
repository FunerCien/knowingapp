import { Entities } from './Entities';
import { Util } from '../components/utilities/utility';

export class Mock {
    public static options: Entities.Option[] =
        [
            new Entities.Option({
                id: 1, action: "READ", module: "OPTIONS", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, update: Util.now(), title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 2, action: "CREATE", module: "PROFILES", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, update: Util.now(), title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 3, action: "READ", module: "PROFILES", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, update: Util.now(), title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 4, action: "UPDATE", module: "PROFILES", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] })
                ]
            }),
            new Entities.Option({
                id: 5, action: "DELETE", module: "PROFILES", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] })
                ]
            }),
            new Entities.Option({
                id: 6, action: "CREATE", module: "PERMITS", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, update: Util.now(), title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 7, action: "READ", module: "PERMITS", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, update: Util.now(), title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 8, action: "DELETE", module: "PERMITS", update: Util.now(), profiles: [
                    new Entities.Profile({ id: 1, update: Util.now(), title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, update: Util.now(), title: "Lider de segmento", options: [] })
                ]
            })
        ];

    public static profiles: Entities.Profile[] = [
        new Entities.Profile({
            id: 1, update: Util.now(), title: "SuperAdministrador", options: [
                new Entities.Option({ id: 1, action: "READ", module: "OPTIONS", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 2, action: "CREATE", module: "PROFILES", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 3, action: "READ", module: "PROFILES", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 4, action: "UPDATE", module: "PROFILES", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 5, action: "DELETE", module: "PROFILES", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 6, action: "CREATE", module: "PERMITS", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 7, action: "READ", module: "PERMITS", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 8, action: "DELETE", module: "PERMITS", update: Util.now(), profiles: [] }),
            ]
        }),
        new Entities.Profile({
            id: 2, update: Util.now(), title: "Administrador", options: [
                new Entities.Option({ id: 1, action: "READ", module: "OPTIONS", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 2, action: "CREATE", module: "PROFILES", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 3, action: "READ", module: "PROFILES", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 6, action: "CREATE", module: "PERMITS", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 7, action: "READ", module: "PERMITS", update: Util.now(), profiles: [] }),
                new Entities.Option({ id: 8, action: "DELETE", module: "PERMITS", update: Util.now(), profiles: [] }),
            ]
        })
    ]
}