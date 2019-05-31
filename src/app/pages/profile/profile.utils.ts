import { Entities } from 'src/app/entities/Entities';

export class ProfileUtils {
    public static implicitCoordinations(profile: Entities.Profile, profiles: Entities.Profile[], coordinator: Boolean): Entities.Profile[] {
        let coordinations: Entities.Profile[] = new Array();
        let coo: Entities.Coordination[] = coordinator ? profiles.find(p => p.lid == profile.lid).coordinators : profiles.find(p => p.lid == profile.lid).coordinated;
        coo.forEach(p => {
            let profile: Entities.Profile = coordinator ? p.coordinator : p.coordinated;
            coordinations.push(profile);
            this.implicitCoordinations(profile, profiles, coordinator).forEach(c => coordinations.push(c));
        });
        return coordinations;
    }
}