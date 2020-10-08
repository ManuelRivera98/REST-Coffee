const { OAuth2Client } = require('google-auth-library');

const { config } = require('../../config');

const client = new OAuth2Client(config.idClientGoogle);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.idClientGoogle,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    password: 'randomPasswordToDB',
    google: true,
  };
}
// verify().catch(console.error);

module.exports = {
  verify,
};