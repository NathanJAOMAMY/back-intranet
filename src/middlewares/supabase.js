const { createClient } = require("@supabase/supabase-js");


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const loginAndCheck = async ()=> {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: "nadrasanamichael@gmail.com",
    password: "0000",
  });

  if (signInError) {
    console.error("Erreur de connexion:", signInError.message);
    return;
  }
}
loginAndCheck()

module.exports = {
  supabase
}