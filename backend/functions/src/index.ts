import * as functions from 'firebase-functions'
import * as express from 'express'

import * as admin from 'firebase-admin'
import * as serviceAccount from './config/serviceAccountKey.json'

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
}

admin.initializeApp({
  credential: admin.credential.cert(params),
});

const app = express()
app.get('/', (req, res) => res.status(200).send('Hey there!'))
exports.app = functions.https.onRequest(app)