export const ROLES = {
    Admin:'Admin',
    Manager:'Manager',
    Chef:'Chef',
    Worker:'Worker',
    Driver:'Driver'
}
export type Role = typeof ROLES[keyof typeof ROLES];