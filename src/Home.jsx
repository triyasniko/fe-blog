import React,{ useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavbarDefault from './NavbarDefault';
import InsertTask from './InsertTask';
import Swal from 'sweetalert2';

const Home = () => {
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);

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
    const fetchDataTasks = async () => {
        try {
            // console.log(`Bearer ${access_token}`);
            const response = await axios({
                Accept: 'application/json',
                url: `${process.env.REACT_APP_API_BASE_URL}/task`,
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
             setTasks(response.data.data);
             console.log("disiniiii####",response.data);
        } catch (error) {
            // Handle errors, e.g., log the error or show a user-friendly message
            console.error("Error fetching tasks data:", error);
            // You might want to redirect or handle the error in a way that makes sense for your application
        }
    };
    const handleDelete = (taskId) => {
        // Tampilkan konfirmasi sebelum menghapus
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    
        if (confirmDelete) {
            // Implementasi logika penghapusan task di sini
            axios.delete(`${process.env.REACT_APP_API_BASE_URL}/task/${taskId}`, {
                headers: {
                  'Authorization': `Bearer ${access_token}`
                }
              })
              .then(response => {
                // Tampilkan SweetAlert setelah penghapusan berhasil
                Swal.fire({
                  icon: 'success',
                  title: 'Task Deleted!',
                  text: `Task with ID ${taskId} has been successfully deleted.`,
                })
                .then(() => {
                    setTasks(prevTasks => prevTasks.filter(task => task.task_id !== taskId));
                    navigate('/');
                });
      
                // TODO: Update state atau lakukan tindakan lain setelah penghapusan berhasil
              })
              .catch(error => {
                // Tangani kesalahan saat melakukan permintaan atau kesalahan dari server
                console.error('Error during task deletion:', error.message);
      
                // Tampilkan SweetAlert jika terjadi kesalahan
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'An error occurred during task deletion.',
                });
              });
        }
      };
      const handleEdit = (taskId) => {
        // Navigasi ke halaman EditTask.jsx dengan menyertakan taskId sebagai parameter jika diperlukan
        navigate(`/editTask/${taskId}`);
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
        fetchDataTasks();
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
                pathname: '/insertTask',
                state: { user: user }
              }}
            
            >
                Write New Task
            </Link>
            {tasks.length > 0 ? (
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.task_id}>
                      <td>{index + 1}</td>
                      <td>{task.task_name}</td>
                      <td>{task.description}</td>
                      <td>{task.category_name}</td>
                      <td>{task.status}</td>
                      <td>{task.priority}</td>
                      <td>{task.due_date}</td>
                        <td>
                            {/* Tambah tombol edit dengan fungsi onClick */}
                            <Button variant="light" className="text-info" onClick={() => handleEdit(task.task_id)}>
                            Edit
                            </Button>
                            {' '}
                            {/* Tambah tombol delete dengan fungsi onClick */}
                            <Button variant="light" className="text-danger" onClick={() => handleDelete(task.task_id)}>
                            Delete
                            </Button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No tasks available.</p>
            )}
        </Col>

      </Row>
    </Container>
    </>
  );
};

export default Home;
