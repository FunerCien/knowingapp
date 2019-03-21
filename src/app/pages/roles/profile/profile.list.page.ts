import { Component, OnInit } from '@angular/core';

@Component({ selector: 'app-profile-list', templateUrl: 'profile.list.page.html' })
export class ProfileListPage implements OnInit {
    allProfiles: {  title: String, options: { title: String }[] }[];

    ngOnInit() {
        this.allProfiles = [
            {
                title: "SuperAdministrador",
                options: [
                    {
                        title: "SuperAdministrador"
                    },
                    {
                        title: "Administrador"
                    },
                    {
                        title: "Coordinador"
                    }
                ]
            },
            {  title: "Crear perfil", options: [] },
            {  title: "Consultar perfil", options: [] },
            {  title: "Actualizar perfil", options: [] },
            {  title: "Eliminar perfil", options: [] },
            {  title: "Crear permiso", options: [] },
            {  title: "Consultar permiso", options: [] },
            {  title: "Eliminar permiso", options: [] }
        ]
    }
}
