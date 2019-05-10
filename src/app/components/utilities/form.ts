import { Entities } from 'src/app/entities/Entities';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Forms {
    static createProfile(profile: Entities.Profile): FormGroup {
        return new FormGroup({
            lid: new FormControl(profile.lid),
            id: new FormControl(profile.id),
            name: new FormControl(profile.name, Validators.required),
            edition: new FormControl(profile.edition)
        });
    }
}