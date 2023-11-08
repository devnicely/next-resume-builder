// List of generic email domains
const genericEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "hotmail.fr",
  "qq.com",
  "aol.com",
  "outlook.com",
  "icloud.com",
  "msn.com",
  "live.com",
  "comcast.net",
  "sbcglobal.net",
  "verizon.net",
  "ymail.com",
  "rocketmail.com",
  "bellsouth.net",
  "mail.com",
  "me.com",
  "att.net",
  "mac.com",
  "cox.net",
  "optonline.net",
  "earthlink.net",
  "juno.com",
];

export const isGenericEmail = (email: string): boolean => {
  const domain = email.split("@")[1];
  if (domain) {
    return genericEmailDomains.includes(domain);
  }
  return false;
};
