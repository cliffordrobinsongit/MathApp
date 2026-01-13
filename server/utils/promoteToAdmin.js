const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function promoteToAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get email from command line arguments
    const email = process.argv[2];

    if (!email) {
      console.error('Error: Please provide an email address');
      console.log('Usage: node server/utils/promoteToAdmin.js <email>');
      process.exit(1);
    }

    // First, add 'student' role to all users without a role field
    const updateResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'student' } }
    );
    console.log(`Updated ${updateResult.modifiedCount} users to have 'student' role`);

    // Find and promote specific user to admin
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!user) {
      console.error(`Error: User with email '${email}' not found`);
      process.exit(1);
    }

    console.log(`✓ Successfully promoted ${user.username} (${user.email}) to admin`);

  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

promoteToAdmin();
