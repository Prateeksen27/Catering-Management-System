import { ROLES } from "@/constants/roles";

export const rolePermissions = {
    [ROLES.Admin]: {
        dashboard: "/dashboard/admin",
        menus: [
            "BOOKINGS_ALL",
            "CALENDAR",
            "EMPLOYEES",
            "MENU",
            "ASSIGN_WORK",
            "ASSIGNED_EVENTS",
            "STORE",
            "INVENTORY",
            "VEHICLES"
        ],
    },
    [ROLES.Manager]: {
        dashboard: "/dashboard/manager",
        menus: [
            "BOOKINGS_INQUIRE",
            "BOOKINGS_BOOKED",
            "BOOKINGS_COMPLETED",
            "CALENDAR",
            "EMPLOYEES",
            "ASSIGN_WORK",
            "MENU",
            "ASSIGNED_EVENTS",
            "STORE",
            "INVENTORY",
            "VEHICLES",
        ],
    },
    [ROLES.Chef]: {
        dashboard: "/dashboard/chef",
        menus: [
            "MENU",
            "INVENTORY",
            "BOOKINGS_BOOKED_READ",
            "ASSIGNED_WORK",
            "CALENDAR",
        ],
    },
    [ROLES.Worker]: {
        dashboard: "/dashboard/worker",
        menus: [
            "BOOKINGS_BOOKED_READ",
            "CALENDAR",
            "ASSIGNED_WORK",
            "STORE",
        ],
    },
    [ROLES.Driver]: {
        dashboard: "/dashboard/driver",
        menus: [
            "BOOKINGS_BOOKED",
            "CALENDAR",
            "ASSIGNED_WORK",
            "VEHICLES",
        ],
    }
}