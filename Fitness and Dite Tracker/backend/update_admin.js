const supabase = require('./config/supabase');
const bcrypt = require('bcryptjs');

async function updateAdmin() {
  const adminId = "6985931b-f25e-4543-91dd-b3eac72e72e6";
  const newEmail = "admin@vitality.com"; // User can change this later
  const newPassword = "AdminPassword2026!"; // User can change this later
  
  console.log(`--- Updating Admin ID: ${adminId} ---`);
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  
  const { error } = await supabase
    .from('users')
    .update({ 
      email: newEmail,
      password_hash: hash,
      name: "Admin" 
    })
    .eq('id', adminId);
  
  if (error) {
    console.error('Error updating admin:', error);
    return;
  }
  
  console.log('Admin updated successfully!');
  console.log(`New Email: ${newEmail}`);
  console.log(`New Password: ${newPassword}`);
}

updateAdmin();
