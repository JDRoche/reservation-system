import { Role } from "./Role";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt: string;
    role: Role;
}