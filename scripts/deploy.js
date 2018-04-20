require("dotenv-safe").config();
const fs = require("fs");
const webStore = require("chrome-webstore-upload")({
  extensionId: process.env.GOOGLE_EXTENSIONID,
  clientId: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_CLIENTSECRET,
  refreshToken: process.env.GOOGLE_REFRESHTOKEN
});

// Fetch a token for uploading and publishing.
webStore
  .fetchToken()
  .then(async (token) => {
    // Get the package.
    const package = fs.createReadStream(`./dist/forms.zip`);

    // Upload the package.
    const uploadResult = await webStore.uploadExisting(package, token);
    if (uploadResult.uploadState !== "SUCCESS") {
      throw uploadResult;
    }
    console.log(`Uploaded {${uploadResult.id}} to Chrome Webstore.`);

    // Publish the updated add-on.
    const publishResult = await webStore.publish("default", token);
    if (publishResult.status[0] !== "OK") {
      throw publishResult;
    }
    console.log(`Published {${publishResult.item_id}} on Chrome Webstore.`);
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });
