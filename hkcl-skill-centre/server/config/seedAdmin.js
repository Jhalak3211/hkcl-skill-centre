import bcrypt from 'bcryptjs';
import Staff from '../models/Staff.js';
import { isDbConnected } from './db.js';

export const memoryStaff = [];

export async function seedInitialAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@hkcl.in').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@hkcl2026';

  const defaultAdmin = {
    name: 'Centre Administrator',
    email: adminEmail,
    phone: '9812345678',
    designation: 'System Administrator',
    role: 'admin',
    status: 'active',
    permissions: {
      canReviewDocuments: true,
      canVerifyPayments: true,
      canProcessAdmissions: true,
    },
    invitedBy: 'System Auto-Seed',
    invitedAt: new Date(),
    acceptedAt: new Date(),
  };

  if (isDbConnected) {
    try {
      const existingAdmin = await Staff.findOne({ role: 'admin' });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await Staff.create({
          ...defaultAdmin,
          password: hashedPassword,
        });
        console.log(`[SeedAdmin] Default administrator account seeded successfully: ${adminEmail}`);
      } else {
        console.log(`[SeedAdmin] Existing administrator account verified: ${existingAdmin.email}`);
      }
      return;
    } catch (err) {
      console.warn('[SeedAdmin] Notice during DB admin verification:', err.message);
    }
  }

  // In-memory fallback
  const inMemoryExisting = memoryStaff.find((s) => s.role === 'admin');
  if (!inMemoryExisting) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    memoryStaff.push({
      _id: 'memory_admin_1',
      id: 'memory_admin_1',
      ...defaultAdmin,
      password: hashedPassword,
      comparePassword: async function (cand) {
        return bcrypt.compare(cand, this.password);
      },
    });
    console.log(`[SeedAdmin] In-memory administrator account created: ${adminEmail}`);
  }
}
