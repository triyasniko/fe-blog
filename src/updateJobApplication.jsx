import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

const UpdateJobApplication = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [positionOptions, setPositionOptions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [companySectorOptions, setCompanySectorOptions] = useState([]);
    const [selectedCompanySectorOptions, setSelectedCompanySectorOptions] = useState('');
    const [applicationDate, setApplicationDate]=useState('');
    const [status, setStatus]=useState('');
    const navigate=useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const { applicationId } = useParams(); 
    const access_token = localStorage.getItem("access_token");
    // console.log(applicationId,"********");
    const fetchDataUser = async () => {
        try {
            // console.log(`Bearer ${access_token}`);
            const response = await axios({
                Accept: 'application/json',
                url: `${process.env.REACT_APP_API_BASE_URL}/user-profile`,
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
             setUser(response.data);
            //  console.log("disiniiii####",response.data);
        } catch (error) {
            // Handle errors, e.g., log the error or show a user-friendly message
            console.error("Error fetching user data:", error);
            // You might want to redirect or handle the error in a way that makes sense for your application
        }
    };

    const fetchDataPositionOptions=()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/position`, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
        })
          .then(response => {
            setPositionOptions(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching position:', error);
          });
    };

    const fetchDataCompanySectorOptions=()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/company`, {
            headers: {
            'Authorization': `Bearer ${access_token}`
            }
        })
        .then(response => {
            setCompanySectorOptions(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
    }

    const fetchJobDetails = async (applicationId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/job/${applicationId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const jobDetails = response.data.data[0]; // Adjust based on your API response structure
            console.log(jobDetails,"########");
            // Set state with task details
            setJobTitle(jobDetails.job_title);
            setCompanyName(jobDetails.company_name);
            setStatus(jobDetails.status);
            setApplicationDate(jobDetails.application_date);
            const positionIdPrevious = response.data.data[0].position_id; 
            setSelectedPosition(positionIdPrevious);
            const companySectorIdPrevious = response.data.data[0].companysector_id;
            setSelectedCompanySectorOptions(companySectorIdPrevious);
        } catch (error) {
            console.error('Error fetching task details:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const newData = {
            user_id:user.user_id,
            job_title:jobTitle,
            company_name:companyName,
            position_id:selectedPosition,
            companysector_id: selectedCompanySectorOptions,
            application_date:applicationDate,
            status:status, // Atur status sesuai kebutuhan
          };
        console.log("###########",newData);
                
        try {
            // Melakukan operasi INSERT ke tabel tasks
            const response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/job/${applicationId}`,
            newData,
            {
                headers: {
                'Authorization': `Bearer ${access_token}`
                }
            }
            );

            console.log('Data updated successfully:', response.data);

            if (response.status >= 200 && response.status < 300) {
                // Menampilkan SweetAlert
                Swal.fire({
                title: 'Success!',
                text: 'Data updated successfully',
                icon: 'success'
                }).then(() => {
                navigate('/');
                });
            } 

        } catch (error) {
            // Handle kesalahan
            console.error('Error updated data:', error);
            Swal.fire({
            title: 'Error!',
            text: 'Failed to updated data',
            icon: 'error'
            });
        }
    }
    
    useEffect(() => {
        fetchDataUser();
        fetchDataPositionOptions();
        fetchDataCompanySectorOptions();
        fetchJobDetails(applicationId);
    }, [applicationId]);
    return (
        <>
        <Container>
            <form onSubmit={handleUpdate} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="jobTitle" className="form-label">
                        Job Title:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="companyName" className="form-label">
                        Company Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="position" className="form-label">
                        Position:
                    </label>
                    <select
                        className="form-select"
                        id="Position"
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                    >
                        <option value="">Select Position</option>
                        {positionOptions.map((position) => (
                            <option key={position.position_id} value={position.position_id}>
                                {position.position_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="companysector" className="form-label">
                        Company Sector:
                    </label>
                    <select
                        className="form-select"
                        id="companysector"
                        value={selectedCompanySectorOptions}
                        onChange={(e) => setSelectedCompanySectorOptions(e.target.value)}
                    >
                        <option value="">Select Company Sector</option>
                        {companySectorOptions.map((companySector) => (
                            <option key={companySector.companysector_id} value={companySector.companysector_id}>
                                {companySector.companysector_name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                        Status:
                    </label>
                    <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="applicationDate" className="form-label">
                        Application Date:
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="applicationDate"
                        value={applicationDate}
                        onChange={(e) => setApplicationDate(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">
                    Update Data
                </button>
                <Link className="btn btn-light border-secondary ml-2" to="/">Back</Link>

            </form>
        </Container>
        </>
    );
};
export default UpdateJobApplication;
