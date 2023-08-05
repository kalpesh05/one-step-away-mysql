/**
 * Send mail using template
 */
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = require("../configs/index");
// console.log("--", process.env.SENDGRID_API_KEY);
sgMail.setApiKey(SENDGRID_API_KEY);
const FROM_MAIL = "support@mathfactlab.com";

exports.welcomeMailSend = async (email, firstName) => {
  const mailTemplate = {
    to: email,
    from: FROM_MAIL,
    templateId: "d-4e9f521ad96e4b40b115cfe191bb26ab",
    dynamicTemplateData: {
      first_name: firstName,
    },
  };

  sgMail
    .send(mailTemplate)
    .then(() => {
      console.log(`Welcome Email :: ${email} :: Send`);
    })
    .catch((e) => {
      console.log("Welcome Email :: Error ::", e);
    });
};

exports.emailVerificationEmailSend = async (email, firstName, link) => {
  const mailTemplate = {
    to: email,
    from: FROM_MAIL,
    templateId: "d-98bbe8e2e877436aa10133c02641bbb9",
    dynamicTemplateData: {
      first_name: firstName,
      link,
    },
  };

  sgMail
    .send(mailTemplate)
    .then(() => {
      console.log(`Email Verification :: ${email} :: Send`);
    })
    .catch((e) => {
      console.log("Email Verification :: Error ::", e);
    });
};

// it's not used
// exports.newUserAdminEmailSend = async (email, firstName, lastName) => {
//   const mailTemplate = {
//     to: process.env.ADMIN_EMAIL,
//     from: FROM_MAIL,
//     templateId: "d-04aeb84c83d4483fa5863b162423304c",
//     dynamicTemplateData: {
//       first_name: firstName,
//       last_name: lastName,
//       email
//     }
//   };

//   sgMail
//     .send(mailTemplate)
//     .then(() => {
//       console.log(
//         `New User Admin Email :: Admin Email :: ${process.env.ADMIN_EMAIL} :: User :: ${email} :: Send`
//       );
//     })
//     .catch(e => {
//       console.log("New User Admin Email :: Error ::", e);
//     });
// };

exports.forgotPasswordEmailSend = async (email, firstName, link) => {
  const mailTemplate = {
    to: email,
    from: FROM_MAIL,
    templateId: "d-5e2403e46ff1402e909e04e303e9fc56",
    dynamicTemplateData: {
      first_name: firstName,
      link,
    },
  };
  // console.log(link);
  sgMail
    .send(mailTemplate)
    .then(() => {
      console.log(`Forgot Password Email :: ${email} :: Send`);
    })
    .catch((e) => {
      console.log("Forgot Password Email :: Error ::", e);
    });
};
