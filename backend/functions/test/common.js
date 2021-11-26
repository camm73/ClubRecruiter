const { signInWithCustomToken } = require('firebase/auth')



async function init(auth, admin) {
    try {
        const uid1 = 'test-uid-1';
        const uid2 = 'test-uid-2';    
        const customToken1 = await admin.auth().createCustomToken(uid1);
        const customToken2 = await admin.auth().createCustomToken(uid2);
        const response1  = await signInWithCustomToken(auth, customToken1)
        idToken1 = response1.user.accessToken
        const response2  = await signInWithCustomToken(auth, customToken2)
        idToken2 = response2.user.accessToken
        return { idToken1, idToken2 };
    } catch (error) {
        console.log("failed!")
        console.log(error);
    }
}

module.exports = { init }