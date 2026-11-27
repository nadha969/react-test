
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

      const username = "doctosmarttest";
      const password = "$2y$12$9Za7UtNOljRUWVmVrq8yv.ZpuzEhK6yzI.gdKRCxw2EtUfvxySV3S";

      const auth = btoa(`${username}:${password}`);

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

      const result = await response.json();

      console.log("Full API Response:", result);

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Failed to fetch patients");
      }

      // Extract records from possible response structures
      const patientList =
        result.data?.patient_list ??
        result.data?.patients ??
        result.patient_list ??
        result.patients ??
        result.data?.records ??
        result.records ??
        result.data ??
        result;

      if (Array.isArray(patientList)) {
        setPatients(patientList);
      } else {
        setPatients([]);
        console.log("Patient array not found:", result);
      }

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to load patient records");
    } finally {
      setLoading(false);
    }
  };

  const getValue = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "-";
  };

  return (
    <div className="container">
      <h1>Patient Management</h1>
      <p className="subtitle">Patient Records</p>

      {loading ? (
        <p className="message">Loading patient records...</p>
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
                patients.map((patient, index) => (
                  <tr key={patient.id || patient.reg_id || index}>
                    <td>
                      {getValue(
                        patient.reg_id ??
                        patient.registration_id ??
                        patient.id
                      )}
                    </td>

                    <td>
                      {getValue(
                        patient.name ??
                        patient.patient_name ??
                        patient.full_name
                      )}
                    </td>

                    <td>{getValue(patient.gender)}</td>

                    <td>
                      {getValue(
                        patient.age ??
                        patient.patient_age
                      )}
                    </td>

                    <td>
                      {getValue(
                        patient.mobile ??
                        patient.mobile_no ??
                        patient.phone
                      )}
                    </td>

                    <td>
                      {getValue(
                        patient.address ??
                        patient.patient_address
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="message">
                    No patient records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
