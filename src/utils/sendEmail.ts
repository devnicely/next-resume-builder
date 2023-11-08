import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.NEXT_SENDGRID_API_KEY ?? "");

const sendVerificationEmail = async ({
  email,
  verificationToken,
}: {
  email: string;
  verificationToken: string;
}) => {
  const msg = {
    to: email,
    from: "no-reply@prospectai.ai",
    subject: "Email Verification",
    html: `<p>Please click the link to verify your email: <a href="${process.env.NEXT_PUBLIC_DEV_URL}/auth/verify-email?email=${email}&token=${verificationToken}">Activation Link</a></p>`,
  };
  await sgMail.send(msg);
};

const resendVerificationEmail = async ({
  email,
  newVerificationToken,
}: {
  email: string;
  newVerificationToken: string;
}) => {
  const msg = {
    to: email,
    from: "no-reply@prospectai.ai",
    subject: "Email Verification",
    html: `<p>Please click the link to verify your email: <a href="${process.env.NEXT_PUBLIC_DEV_URL}/auth/verify-email?email=${email}&token=${newVerificationToken}">Activation Link</a></p>`,
  };
  await sgMail.send(msg);
};

const sendEmailChangeRequest = async ({
  email,
  verificationToken,
}: {
  email: string;
  verificationToken: string;
}) => {
  const msg = {
    to: email,
    from: "no-reply@prospectai.ai",
    subject: "Email change request",
    html: `<p>Please click the link to verify your new email: <a href="${process.env.NEXT_PUBLIC_DEV_URL}/user/account?email=${email}&token=${verificationToken}">Verification Link</a></p>`,
  };
  await sgMail.send(msg);
};

const sendOrgInvite = async ({
  email,
  verificationToken,
  orgId,
}: {
  email: string;
  verificationToken: string;
  orgId: string;
}) => {
  const msg = {
    to: email,
    from: "no-reply@prospectai.ai",
    subject: "Organization Invitation",
    html: `<p>You have been invited to join an organization. Click the link to accept the invitation: <a href="${process.env.NEXT_PUBLIC_DEV_URL}/accept-invite?email=${email}&orgId=${orgId}&token=${verificationToken}">Accept Invitation</a></p>`,
  };
  await sgMail.send(msg);
};

const sendInviteToParse = async ({
  email,
  resumeID,
}: {
  email: string;
  resumeID: string;
}) => {
  const msg = {
    to: email,
    from: "no-reply@prospectai.ai",
    subject: "Invitation to work on a parsing!",
    html: `<p>You have been invited to join an organization. Click the link to accept the invitation: <a href="${process.env.NEXT_PUBLIC_DEV_URL}/accept-invite?email=${email}&resumeID=${resumeID}">Accept Invitation</a></p>`,
  };
  await sgMail.send(msg);
};

export {
  sendEmailChangeRequest,
  sendVerificationEmail,
  resendVerificationEmail,
  sendOrgInvite,
  sendInviteToParse,
};
