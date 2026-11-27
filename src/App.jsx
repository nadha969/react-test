
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      // Basic Authentication
      const username = "doctosmarttest";
      const password = "$2y$12$9Za7UtNOljRUWVmVrq8yv.ZpuzEhK6yzI.gdKRCxw2EtUfvxySV3S";

      const auth = btoa(`${username}:${password}`);

      // API request
      const response = await fetch(
        "/api/patients?user_id=1&clinic_id=1&page_no=0",
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      // Actual patient array is inside result
      if (Array.isArray(data.result)) {
        setPatients(data.result);
      } else {
        setPatients([]);
        throw new Error("Patient records not found");
      }

    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show "-" for empty values
  const getValue = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "-";
  };

  return (
    <div className="container">

      <h1>Patient Management</h1>
      <p className="subtitle">
        Patient Records
      </p>

      {loading ? (
        <p className="message">Loading patients...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (

        <div className="table-container">

          <table>
            <thead>
              <tr>
                <th>Reg. ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Mobile</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>

              {patients.length > 0 ? (
                patients.map((patient) => (

                  <tr key={patient.id}>

                    <td>
                      {getValue(patient.registration_id)}
                    </td>

                    <td>
                      {getValue(patient.patient_name)}
                    </td>

                    <td>
                      {getValue(patient.gender)}
                    </td>

                    <td>
                      {getValue(patient.age)}
                    </td>

                    <td>
                      {getValue(patient.mobile ?? patient.mobile_no)}
                    </td>

                    <td>
                      {getValue(patient.address)}
                    </td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="6" className="message">
                    No patients found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

          <p className="total">
            Total Patients: {patients.length} / 200
          </p>

        </div>
      )}

    </div>
  );
}

export default App;
