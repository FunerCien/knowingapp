import { Entities } from 'src/app/entities/Entities';

export class ProfileUtils {
    constructor(private profiles: Entities.Profile[]) { }
    public implicitCoordinations(profile: Entities.Profile, coordinator: Boolean): Entities.Profile[] {
        let coordinations: Entities.Profile[] = new Array();
        let coo: Entities.Coordination[] = coordinator ? this.profiles.find(p => p.lid == profile.lid).coordinators : this.profiles.find(p => p.lid == profile.lid).coordinated;
        coo.forEach(p => {
            let profile: Entities.Profile = coordinator ? p.coordinator : p.coordinated;
            coordinations.push(profile);
            this.implicitCoordinations(profile, coordinator).forEach(c => coordinations.push(c));
        });
        return coordinations;
    }
}