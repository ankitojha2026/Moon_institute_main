const bcrypt = require('bcryptjs');

// Test password hashing
async function testPasswordHashing() {
  console.log('🔐 Testing Password Hashing...\n');

  const testPassword = 'test123456';
  const saltRounds = 12;

  try {
    // Hash password
    console.log('📝 Original Password:', testPassword);
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
    console.log('🔒 Hashed Password:', hashedPassword);
    console.log('📏 Hash Length:', hashedPassword.length, 'characters\n');

    // Verify password
    console.log('✅ Verifying password...');
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log('🔍 Password Match:', isMatch ? '✅ YES' : '❌ NO');

    // Test wrong password
    console.log('\n❌ Testing wrong password...');
    const wrongPassword = 'wrongpassword';
    const isWrongMatch = await bcrypt.compare(wrongPassword, hashedPassword);
    console.log('🔍 Wrong Password Match:', isWrongMatch ? '❌ YES (This should be false)' : '✅ NO (Correct)');

    // Test multiple hashes (should be different)
    console.log('\n🔄 Testing multiple hashes...');
    const hash1 = await bcrypt.hash(testPassword, saltRounds);
    const hash2 = await bcrypt.hash(testPassword, saltRounds);
    console.log('Hash 1:', hash1);
    console.log('Hash 2:', hash2);
    console.log('Hashes are different:', hash1 !== hash2 ? '✅ YES (Good for security)' : '❌ NO (Security issue)');

    // Verify both hashes work
    const match1 = await bcrypt.compare(testPassword, hash1);
    const match2 = await bcrypt.compare(testPassword, hash2);
    console.log('Both hashes verify correctly:', match1 && match2 ? '✅ YES' : '❌ NO');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testPasswordHashing();
