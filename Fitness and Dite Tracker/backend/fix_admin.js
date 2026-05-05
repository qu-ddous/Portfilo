const supabase = require('./config/supabase');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  const adminId = "6985931b-f25e-4543-91dd-b3eac72e72e6";
  const finalEmail = "admin@vitality.com";
  const finalPassword = "AdminPassword2026!";
  
  console.log(`--- Resetting Admin to known state ---`);
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(finalPassword, salt);
  
  const { error } = await supabase
    .from('users')
    .update({ 
      email: finalEmail,
      password_hash: hash,
      name: "Admin",
      role: 'admin' // ensure role is still admin
    })
    .eq('id', adminId);
  
  if (error) {
    console.error('Error fixing admin:', error);
    return;
  }
  
  console.log('✅ Admin Reset Success!');
  console.log(`Email: ${finalEmail}`);
  console.log(`Password: ${finalPassword}`);
  console.log('Use THESE credentials to login now.');
}

fixAdmin();
