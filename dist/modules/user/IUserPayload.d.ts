interface IUserPayload {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    gender?: 'male' | 'female';
    age?: number;
    phone?: string;
    photo_url?: string;
}
export default IUserPayload;
//# sourceMappingURL=IUserPayload.d.ts.map