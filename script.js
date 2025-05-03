// Store Data
// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  // ... paste your config here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg9zyGuXI4X2IgOlc8VG0tNitzmaK_E2g",
  authDomain: "volunteer-tracker-6f093.firebaseapp.com",
  projectId: "volunteer-tracker-6f093",
  storageBucket: "volunteer-tracker-6f093.firebasestorage.app",
  messagingSenderId: "102539372939",
  appId: "1:102539372939:web:7ffd4d04e2f64f05e8e78e",
  measurementId: "G-DT9LDB9K34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to volunteers collection
const volunteersRef = db.collection("volunteers");

// Modified functions
async function addVolunteer() {
  const name = document.getElementById('volunteerName').value;
  const date = document.getElementById('eventDate').value;
  const contact = document.getElementById('contactInfo').value;
  const hours = document.getElementById('hoursServed').value;
  const serviceType = document.getElementById('serviceType').value;

  if (!name || !date) {
    alert('Please enter name and date');
    return;
  }

  try {
    await volunteersRef.add({
      name,
      date,
      contact,
      hours: parseFloat(hours),
      serviceType,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    updateVolunteerTable();
    clearForm();
  } catch (error) {
    console.error("Error adding volunteer: ", error);
  }
}

async function updateVolunteerTable() {
  const tableBody = document.querySelector('#volunteerTable tbody');
  tableBody.innerHTML = '';
  
  const selectedDate = document.getElementById('eventDate').value;
  
  try {
    const querySnapshot = await volunteersRef
      .where("date", "==", selectedDate)
      .orderBy("timestamp")
      .get();

    querySnapshot.forEach((doc) => {
      const volunteer = doc.data();
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${volunteer.name}</td>
        <td>${volunteer.contact || 'N/A'}</td>
        <td>${volunteer.hours}</td>
        <td>${volunteer.serviceType}</td>
        <td>
          <button onclick="editVolunteer('${doc.id}')">Edit</button>
          <button onclick="deleteVolunteer('${doc.id}')">Delete</button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error getting volunteers: ", error);
  }
}

async function deleteVolunteer(id) {
  if (confirm('Delete this volunteer record?')) {
    try {
      await volunteersRef.doc(id).delete();
      updateVolunteerTable();
    } catch (error) {
      console.error("Error deleting volunteer: ", error);
    }
  }
}

async function editVolunteer(id) {
  try {
    const doc = await volunteersRef.doc(id).get();
    if (doc.exists) {
      const volunteer = doc.data();
      document.getElementById('volunteerName').value = volunteer.name;
      document.getElementById('eventDate').value = volunteer.date;
      document.getElementById('contactInfo').value = volunteer.contact;
      document.getElementById('hoursServed').value = volunteer.hours;
      document.getElementById('serviceType').value = volunteer.serviceType;
      
      // Delete the old record
      await deleteVolunteer(id);
    }
  } catch (error) {
    console.error("Error editing volunteer: ", error);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('eventDate').valueAsDate = new Date();
  updateVolunteerTable();
});