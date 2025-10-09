import defaultDoctorImage from "../assets/img/defaultClinicImage.jpg";

// Get direct link for Google Drive images
export function getDirectGoogleDriveLink(url) {
  const match = url.match(/\/d\/([^/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

// Get photo URL with fallback to default image
export function getPhotoUrl(profilePhoto) {
  return profilePhoto && profilePhoto.trim() !== ""
    ? getDirectGoogleDriveLink(profilePhoto)
    : defaultDoctorImage;
}
