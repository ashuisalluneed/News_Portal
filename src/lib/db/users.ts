import bcrypt from 'bcryptjs';

/**
 * Mock user database
 * In production, replace this with a real database (PostgreSQL, MongoDB, etc.)
 */

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Hashed password
    image?: string;
    createdAt: Date;
}

// Mock users storage
// Initial user: demo@example.com / demo123
// Hash generated for 'demo123'
const users: User[] = [
    {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        password: '$2a$10$EpWaTgiFB8j5Wj.5eE6x..b.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5', // Placeholder, will be reset on save
        image: undefined,
        createdAt: new Date('2024-01-01'),
    },
];

// Initialize demo user with correct hash on load (if possible)
// Note: This is a hack for the in-memory DB. In real DB, data is persistent.
try {
    const salt = bcrypt.genSaltSync(10);
    users[0].password = bcrypt.hashSync('demo123', salt);
} catch (e) {
    console.error('Failed to hash initial password', e);
}

/**
 * Find user by email
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
    return users.find((user) => user.email === email);
}

/**
 * Find user by ID
 */
export async function getUserById(id: string): Promise<User | undefined> {
    return users.find((user) => user.id === id);
}

/**
 * Create a new user
 */
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser: User = {
        ...userData,
        password: hashedPassword,
        id: String(users.length + 1),
        createdAt: new Date(),
    };

    users.push(newUser);
    return newUser;
}

/**
 * Verify user credentials
 */
export async function verifyCredentials(
    email: string,
    password: string
): Promise<User | null> {
    const user = await getUserByEmail(email);

    if (!user) {
        return null;
    }

    // Compare hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        return user;
    }

    return null;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return users.map(({ password, ...user }) => user);
}
