export type EnrollmentType = "personal" | "group";
export interface ApplicantInfo {
   name: string;
   email: string;
   phone: string;
   motivation: string;
}
export interface Participant {
   name: string;
   email: string;
}

export interface GroupInfo {
   organizationName: string;
   headCount: number;
   participants: Participant[];
   contactPerson: string;
}
