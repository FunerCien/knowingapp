import { Entities } from 'src/app/entities/Entities';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Forms {
    static createProfile(profile: Entities.Profile): FormGroup {
        return new FormGroup({
            id: new FormControl({ value: profile.id, disabled: true }),
            name: new FormControl({ value: profile.name, disabled: profile.id === 1 }, Validators.required)
        });
    }
}