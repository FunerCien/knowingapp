import { Entities } from './Entities';

export class Mock {
    public static options: Entities.Option[] =
        [
            new Entities.Option({
                id: 1, action: "READ", category: "OPTIONS", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 2, action: "CREATE", category: "PROFILES", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 3, action: "READ", category: "PROFILES", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 4, action: "UPDATE", category: "PROFILES", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] })
                ]
            }),
            new Entities.Option({
                id: 5, action: "DELETE", category: "PROFILES", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] })
                ]
            }),
            new Entities.Option({
                id: 6, action: "CREATE", category: "PERMITS", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 7, action: "READ", category: "PERMITS", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, title: "Lider de segmento", options: [] })
                ]
            }),
            new Entities.Option({
                id: 8, action: "DELETE", category: "PERMITS", profiles: [
                    new Entities.Profile({ id: 1, title: "SuperAdministrador", options: [] }),
                    new Entities.Profile({ id: 2, title: "Lider de segmento", options: [] })
                ]
            })
        ];

    public static profiles: Entities.Profile[] = [
        new Entities.Profile({
            id: 1, title: "SuperAdministrador", options: [
                new Entities.Option({ id: 1, action: "READ", category: "OPTIONS", profiles: [] }),
                new Entities.Option({ id: 2, action: "CREATE", category: "PROFILES", profiles: [] }),
                new Entities.Option({ id: 3, action: "READ", category: "PROFILES", profiles: [] }),
                new Entities.Option({ id: 4, action: "UPDATE", category: "PROFILES", profiles: [] }),
                new Entities.Option({ id: 5, action: "DELETE", category: "PROFILES", profiles: [] }),
                new Entities.Option({ id: 6, action: "CREATE", category: "PERMITS", profiles: [] }),
                new Entities.Option({ id: 7, action: "READ", category: "PERMITS", profiles: [] }),
                new Entities.Option({ id: 8, action: "DELETE", category: "PERMITS", profiles: [] }),
            ]
        }),
        new Entities.Profile({
            id: 2, title: "Administrador", options: [
                new Entities.Option({ id: 1, action: "READ", category: "OPTIONS", profiles: [] }),
                new Entities.Option({ id: 2, action: "CREATE", category: "PROFILES", profiles: [] }),
                new Entities.Option({ id: 3, action: "READ", category: "PROFILES", profiles: [] }),
                new Entities.Option({ id: 6, action: "CREATE", category: "PERMITS", profiles: [] }),
                new Entities.Option({ id: 7, action: "READ", category: "PERMITS", profiles: [] }),
                new Entities.Option({ id: 8, action: "DELETE", category: "PERMITS", profiles: [] }),
            ]
        })
    ]
}