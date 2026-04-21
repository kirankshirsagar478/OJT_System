/**
 * Script to reset ALL user passwords to '123456'
 * Run this if you're having trouble logging into any account.
 * 
 * Usage: node resetAllPasswords.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const NEW_PASSWORD = '123456';

const resetAll = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ojt_system';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    // Use updateMany with direct MongoDB update to bypass pre-save hook
    const result = await User.updateMany(
      {},
      { $set: { password: hashedPassword, accountStatus: 'active' } }
    );

    console.log(`✅ Reset passwords for ${result.modifiedCount} users to: ${NEW_PASSWORD}\n`);

    const allUsers = await User.find({}).select('fullName email role accountStatus');
    console.log('=== All accounts (password: 123456) ===');
    allUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.email} | Role: ${u.role} | Status: ${u.accountStatus}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAll();
