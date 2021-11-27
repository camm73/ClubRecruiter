const { builtinModules } = require("module");

// collection names
module.exports.CANDIDATES_COLLECTION = "Candidates";
module.exports.EVENTS_COLLECTION = "Events";
module.exports.CLUB_MEMBERS_COLLECTION = "ClubMembers";
module.exports.EVENT_MEMBERS_COLLECTION = "ClubMembers_Events";
module.exports.COMMENTS_COLLECTION = "Comments";

module.exports.CODE_LENGTH = 6;

module.exports.MEMBER_CODE = "member_code";
module.exports.CANDIDATE_CODE = "candidate_code";

module.exports.CLOUD_STORAGE_BUCKET_URL = "recruitme-4b479.appspot.com";

module.exports.FROM_EMAIL = "recruitme130@gmail.com";

module.exports.EMAIL_TEMPLATE_TOP = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Transactional Email</title>
      <style>
        @media only screen and (max-width: 620px) {
          table.body h1 {
          font - size: 28px !important;
        margin-bottom: 10px !important;
}

        table.body p,
        table.body ul,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font - size: 16px !important;
}

        table.body .wrapper,
        table.body .article {
          padding: 10px !important;
}

        table.body .content {
          padding: 0 !important;
}

        table.body .container {
          padding: 0 !important;
        width: 100% !important;
}

        table.body .main {
          border - left - width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
}

        table.body .btn table {
          width: 100% !important;
}

        table.body .btn a {
          width: 100% !important;
}

        table.body .img-responsive {
          height: auto !important;
        max-width: 100% !important;
        width: auto !important;
}
}
        @media all {
.ExternalClass {
          width: 100%;
}

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line - height: 100%;
}

        .apple-link a {
          color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
}

        #MessageViewBody a {
          color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
}

        .btn-primary table td:hover {
          background - color: #34495e !important;
}

        .btn-primary a:hover {
          background - color: #34495e !important;
        border-color: #34495e !important;
}
}
      </style>
    </head>
    <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Hi from __{event_name}__</span>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
        <tr>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
            <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">

              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
`

module.exports.EMAIL_TEMPLATE_BOTTOM = `
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
            </div>
          </td>
          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>`;