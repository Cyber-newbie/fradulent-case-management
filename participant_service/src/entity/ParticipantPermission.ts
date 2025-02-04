import { Builder, Getter } from "../decorator/helper.decorator";

@Builder
@Getter
export class ParticipantPermission {

    private participantId: number;
    private permissionId: number;

    constructor(){
        this.participantId = 0;
        this.permissionId = 0
    }

}
