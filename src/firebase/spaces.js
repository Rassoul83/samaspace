import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const SPACES = "espaces";
const BOOKINGS = "reservations";
const REVIEWS = "avis";
const FAVORITES = "favoris";

// --- Espaces ---
export async function listSpaces(filters = {}) {
  let q = collection(db, SPACES);
  const clauses = [];
  if (filters.ville) clauses.push(where("ville", "==", filters.ville));
  if (filters.activite) clauses.push(where("activites", "array-contains", filters.activite));
  if (filters.verifieOnly) clauses.push(where("verifie", "==", true));
  q = clauses.length ? query(collection(db, SPACES), ...clauses) : query(collection(db, SPACES), orderBy("creeLe", "desc"), limit(60));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getSpace(id) {
  const ref = doc(db, SPACES, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createSpace(ownerId, data) {
  return addDoc(collection(db, SPACES), {
    ...data,
    proprietaireId: ownerId,
    verifie: false,
    note: 0,
    nombreAvis: 0,
    creeLe: serverTimestamp(),
  });
}

export async function updateSpace(id, data) {
  return updateDoc(doc(db, SPACES, id), data);
}

export async function deleteSpace(id) {
  return deleteDoc(doc(db, SPACES, id));
}

export async function listSpacesByOwner(ownerId) {
  const q = query(collection(db, SPACES), where("proprietaireId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// --- Reservations / demandes ---
export async function createBooking(data) {
  return addDoc(collection(db, BOOKINGS), {
    ...data,
    statut: "en_attente", // en_attente | confirmee | refusee | annulee
    creeLe: serverTimestamp(),
  });
}

export async function listBookingsByClient(clientId) {
  const q = query(collection(db, BOOKINGS), where("clientId", "==", clientId), orderBy("creeLe", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listBookingsByOwner(ownerId) {
  const q = query(collection(db, BOOKINGS), where("proprietaireId", "==", ownerId), orderBy("creeLe", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateBookingStatus(id, statut) {
  if (statut === "confirmee") {
    const snap = await getDoc(doc(db, BOOKINGS, id));
    const booking = snap.data();
    if (booking?.clientId && booking.clientId === booking.proprietaireId) {
      throw new Error("Auto-réservation interdite : le client et le propriétaire sont le même compte.");
    }
  }
  return updateDoc(doc(db, BOOKINGS, id), { statut });
}

// --- Favoris ---
export async function addFavorite(userId, spaceId) {
  return setDoc(doc(db, FAVORITES, `${userId}_${spaceId}`), {
    userId,
    spaceId,
    creeLe: serverTimestamp(),
  });
}

export async function removeFavorite(userId, spaceId) {
  return deleteDoc(doc(db, FAVORITES, `${userId}_${spaceId}`));
}

export async function listFavorites(userId) {
  const q = query(collection(db, FAVORITES), where("userId", "==", userId), orderBy("creeLe", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function isFavorite(userId, spaceId) {
  const snap = await getDoc(doc(db, FAVORITES, `${userId}_${spaceId}`));
  return snap.exists();
}

// --- Avis ---
export async function createReview(spaceId, data) {
  return addDoc(collection(db, REVIEWS), {
    ...data,
    espaceId: spaceId,
    creeLe: serverTimestamp(),
  });
}

export async function listReviewsBySpace(spaceId) {
  const q = query(collection(db, REVIEWS), where("espaceId", "==", spaceId), orderBy("creeLe", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
