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

export interface PersonalEnrollmentRequest {
   courseId: string;
   type: "personal";
   applicant: {
      name: string;
      email: string;
      phone: string;
      motivation?: string;
   };
   agreedToTerms: boolean;
}

export interface GroupEnrollmentRequest {
   courseId: string;
   type: "group";
   applicant: {
      name: string;
      email: string;
      phone: string;
      motivation?: string;
   };
   group: {
      organizationName: string;
      headCount: number;
      participants: Participant[];
      contactPerson: string;
   };
   agreedToTerms: boolean;
}

export type EnrollmentRequest =
   | PersonalEnrollmentRequest
   | GroupEnrollmentRequest;

export interface EnrollmentResponse {
   enrollmentId: string;
   status: "confirmed" | "pending";
   enrolledAt: string;
}

export interface ErrorResponse {
   code: "COURSE_FULL" | "DUPLICATE_ENROLLMENT" | "INVALID_INPUT";
   message: string;
   details?: Record<string, string>;
}
