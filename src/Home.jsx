import React,{ useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavbarDefault from './NavbarDefault';
import InsertJobApplication from './insertJobApplication';
import Swal from 'sweetalert2';

const Home = () => {
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);

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
    const fetchDataJobs = async () => {
        try {
            // console.log(`Bearer ${access_token}`);
            const response = await axios({
                Accept: 'application/json',
                url: `${process.env.REACT_APP_API_BASE_URL}/job`,
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
             setJobs(response.data.data);
             console.log("disiniiii####",response.data);
        } catch (error) {
            // Handle errors, e.g., log the error or show a user-friendly message
            console.error("Error fetching jobs data:", error);
            // You might want to redirect or handle the error in a way that makes sense for your application
        }
    };
    const handleDelete = (applicationId) => {
        // Tampilkan konfirmasi sebelum menghapus
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    
        if (confirmDelete) {
            // Implementasi logika penghapusan job di sini
            axios.delete(`${process.env.REACT_APP_API_BASE_URL}/job/${applicationId}`, {
                headers: {
                  'Authorization': `Bearer ${access_token}`
                }
              })
              .then(response => {
                // Tampilkan SweetAlert setelah penghapusan berhasil
                Swal.fire({
                  icon: 'success',
                  title: 'Job Deleted!',
                  text: `Job with ID ${applicationId} has been successfully deleted.`,
                })
                .then(() => {
                    // setJobs(prevJobs => prevJobs.filter(job => job.application_id !== applicationId));
                    setJobs(prevJobs => {
                      const updatedJobs = prevJobs.filter(job => job.application_id !== applicationId);
                      console.log('Updated Jobs:', updatedJobs);
                      return updatedJobs;
                    });
                    
                    navigate('/');
                });
      
                // TODO: Update state atau lakukan tindakan lain setelah penghapusan berhasil
              })
              .catch(error => {
                // Tangani kesalahan saat melakukan permintaan atau kesalahan dari server
                console.error('Error during job deletion:', error.message);
      
                // Tampilkan SweetAlert jika terjadi kesalahan
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'An error occurred during job deletion.',
                });
              });
        }
      };
      const handleEdit = (applicationId) => {
        // console.log(applicationId,"#@#@#@#@#@@#");
        navigate(`/editJobApplication/${applicationId}`);
      };
    //hook useEffect
    useEffect(() => {
        // console.log("disiniiii");
        //check token empty
        if(!access_token) {
            //redirect login page
            navigate('/login');
        }
        //call function "fetchData"
        fetchDataUser();
        fetchDataJobs();
    }, []);
    //console.log(user,"#############");
  return (
    <>
    <NavbarDefault user={user} />
    <Container className="mt-5">
      <Row>
        <Col md={12}>
            <Link className="btn btn-sm btn-light mb-1 border-secondary" 
            to={{
                pathname: '/insertJobApplication',
                state: { user: user }
              }}
            
            >
                Insert Job Application
            </Link>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <Card key={job.application_id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{job.job_title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Position: {job.position_name}</Card.Subtitle>
                    <Card.Text>
                      <strong>Company:</strong> {job.company_name}<br />
                      <strong>Status:</strong> {job.status}<br />
                      <strong>Company Sector:</strong> {job.companysector_name}<br />
                      <strong>Application Date:</strong> {job.application_date}
                    </Card.Text>
                    <Button variant="info" className="mr-2" onClick={() => handleEdit(job.application_id)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(job.application_id)}>
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No jobs available.</p>
            )}
        </Col>

      </Row>
    </Container>
    </>
  );
};

export default Home;
