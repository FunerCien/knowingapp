import { Entities } from 'src/app/entities/Entities';
import { FormGroup, Validators, FormControl } from '@angular/forms';

export class Forms {
    static createProfile(profile: Entities.Profile): FormGroup {
        return new FormGroup({
            id: new FormControl({ value: profile.id, disabled: false }),
            title: new FormControl({ value: profile.title, disabled: profile.id === 1 }, Validators.required)
        });
    }
    static setBasicDataToProfile(profile: Entities.Profile, form: FormGroup): Entities.Profile {
        profile.id = form.value.id;
        profile.title = form.value.title;
        return profile;
    }
}