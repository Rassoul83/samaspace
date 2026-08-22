import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_lmccuqx";

emailjs.init("WC7UoaFOinM8gRqRx");

export async function sendNewRequestEmail(params) {
  await emailjs.send(SERVICE_ID, "template_81nia1a", params).catch((err) => {
    console.error("emailjs sendNewRequestEmail:", err);
  });
}

export async function sendStatusEmail(params) {
  await emailjs.send(SERVICE_ID, "template_3jcc49p", params).catch((err) => {
    console.error("emailjs sendStatusEmail:", err);
  });
}
