import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Facility from "@/models/Facility";
import { hashPassword } from "@/lib/password";

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const facilitySeedData = [
    // Snooker
    {
        name: "Snooker Table 1",
        type: "Snooker",
        location: "Sports Complex – Room A",
        capacity: 2,
        status: "Active",
    },
    {
        name: "Snooker Table 2",
        type: "Snooker",
        location: "Sports Complex – Room A",
        capacity: 2,
        status: "Active",
    },
    // Football
    {
        name: "Football Field 1",
        type: "Football",
        location: "Outdoor Field – North",
        capacity: 22,
        status: "Active",
    },
    {
        name: "Football Field 2",
        type: "Football",
        location: "Outdoor Field – South",
        capacity: 22,
        status: "Active",
    },
    // Badminton
    {
        name: "Badminton Court 1",
        type: "Badminton",
        location: "Indoor Hall – Court 1",
        capacity: 4,
        status: "Active",
    },
    {
        name: "Badminton Court 2",
        type: "Badminton",
        location: "Indoor Hall – Court 2",
        capacity: 4,
        status: "Active",
    },
    {
        name: "Badminton Court 3",
        type: "Badminton",
        location: "Indoor Hall – Court 3",
        capacity: 4,
        status: "Active",
    },
];

const userSeedData = [
    // Admin account
    {
        name: "Admin",
        studentId: "ADMIN001",
        email: "admin@au.edu",
        password: "12345678",
        role: "Admin",
    },
    // Sample student accounts
    {
        name: "Thant Zin Oo",
        studentId: "6722060",
        email: "u6722060@au.edu",
        password: "12345678",
        role: "Student",
    },
    {
        name: "Shoon Moe Aung",
        studentId: "6722052",
        email: "u6722052@au.edu",
        password: "12345678",
        role: "Student",
    },
];

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

export async function seedFacilities() {
    await dbConnect();

    const results = { created: 0, skipped: 0 };

    for (const data of facilitySeedData) {
        const exists = await Facility.findOne({ name: data.name });
        if (exists) {
            results.skipped++;
            continue;
        }
        await Facility.create(data);
        results.created++;
    }

    return results;
}

export async function seedUsers() {
    await dbConnect();

    const results = { created: 0, skipped: 0 };

    for (const data of userSeedData) {
        const exists = await User.findOne({
            $or: [{ email: data.email }, { studentId: data.studentId }],
        });
        if (exists) {
            results.skipped++;
            continue;
        }
        const hashed = await hashPassword(data.password);
        await User.create({ ...data, password: hashed });
        results.created++;
    }

    return results;
}

export async function seedAll() {
    const [facilities, users] = await Promise.all([seedFacilities(), seedUsers()]);
    return { facilities, users };
}
