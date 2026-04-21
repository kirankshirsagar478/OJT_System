/**
 * Script to create or reset the admin account.
 * 
 * Usage: node createAdmin.js
 * 
 * This will:
 *  1. Check if an admin account already exists in the database
 *  2. If YES → reset its password to '123456'
 *  3. If NO  → create a new admin account with email 'admin@test.com' and password '123456'
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = '123456';
const ADMIN_NAME = 'System Admin';

const createOrResetAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ojt_system';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Check if admin account already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log(`Found existing admin account:`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name:  ${existingAdmin.fullName}`);
      console.log(`   Status: ${existingAdmin.accountStatus}`);
      console.log('');

      // Reset the password - hash it manually to bypass pre-save hook issues
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      // Update password and ensure account is active
      await User.updateOne(
        { _id: existingAdmin._id },
        { 
          $set: { 
            password: hashedPassword, 
            accountStatus: 'active' 
          } 
        }
      );

      console.log('✅ Admin password has been RESET successfully!');
      console.log(`   Email:    ${existingAdmin.email}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    } else {
      console.log('No admin account found. Creating a new one...\n');

      // Hash password manually (don't rely on pre-save hook for this script)
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      // Create admin directly with pre-hashed password using insertOne
      // to bypass the pre-save hook (which would double-hash)
      await User.collection.insertOne({
        fullName: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        accountStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Admin account CREATED successfully!');
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    }

    console.log('\n--- You can now login with these credentials ---\n');

    // Also list all users in the database for debugging
    console.log('=== All users in database ===');
    const allUsers = await User.find({}).select('fullName email role accountStatus');
    allUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.fullName} | ${u.email} | Role: ${u.role} | Status: ${u.accountStatus}`);
    });
    console.log(`\nTotal users: ${allUsers.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createOrResetAdmin();
