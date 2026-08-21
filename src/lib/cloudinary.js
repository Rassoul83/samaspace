const CLOUD_NAME = "doeh9xdgt";
const UPLOAD_PRESET = "samaspace_espaces";

export async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body }
  );

  if (!res.ok) throw new Error("Échec de l'upload Cloudinary");

  const data = await res.json();
  return data.secure_url;
}
