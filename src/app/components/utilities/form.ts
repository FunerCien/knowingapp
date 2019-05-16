import { Entities } from 'src/app/entities/Entities';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Forms {
    static getProfile(profile: Entities.Profile): FormGroup {
        profile.name = profile.name ? profile.name.trim() : "";
        return new FormGroup({
            lid: new FormControl(profile.lid),
            id: new FormControl(profile.id),
            name: new FormControl(profile.name, [Validators.required, Validators.minLength(1)]),
            edition: new FormControl(profile.edition)
        });
    }
}