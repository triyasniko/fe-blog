// Login.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

const InsertTask = () => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [status, setStatus]=useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const navigate=useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const access_token = localStorage.getItem("access_token");
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

    useEffect(() => {
        fetchDataUser();
        // Ambil data kategori dari endpoint
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`)
          .then(response => {
            setCategoryOptions(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
    }, []);

    // console.log(user);
    const handleSubmit = async (event) => {
        event.preventDefault();

        const newData = {
            user_id:user.user_id,
            task_name:taskName,
            description:description,
            category_id: selectedCategory,
            priority:priority,
            due_date:dueDate,
            status:status, // Atur status sesuai kebutuhan
          };
        // console.log(newData);
                
        try {
            // Melakukan operasi INSERT ke tabel tasks
            const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/task`,
            newData,
            {
                headers: {
                'Authorization': `Bearer ${access_token}`
                }
            }
            );

            console.log('Data inserted successfully:', response.data);

            if (response.status >= 200 && response.status < 300) {
            // Mendapatkan task_id yang baru saja diinsert
                console.log("#########",response.data.data);
                const task_id = response.data.data.id; // Menggunakan response.data.insertId sesuai dengan struktur response yang diharapkan
                console.log(task_id,"#########");
                
                // Melakukan operasi INSERT ke tabel task_categories
                await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/task-category`,
                    {
                        task_id: task_id,
                        category_id: selectedCategory,
                    },
                    {
                        headers: {
                        'Authorization': `Bearer ${access_token}`
                        }
                    }
                );
    
                // Menampilkan SweetAlert
                Swal.fire({
                title: 'Success!',
                text: 'Data inserted successfully',
                icon: 'success'
                }).then(() => {
                navigate('/');
                });
            } 

        } catch (error) {
            // Handle kesalahan
            console.error('Error inserting data:', error);
            Swal.fire({
            title: 'Error!',
            text: 'Failed to insert data',
            icon: 'error'
            });
        }
    }

    return (
        <>
        <Container>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="taskName" className="form-label">
                        Task Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description:
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                        Category:
                    </label>
                    <select
                        className="form-select"
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categoryOptions.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
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
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">
                        Priority:
                    </label>
                    <select
                        className="form-select"
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="">Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="dueDate" className="form-label">
                        Due Date:
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">
                    Insert Data
                </button>
                <Link className="btn btn-light border-secondary ml-2" to="/">Back</Link>

            </form>
        </Container>
        </>

    );
};

export default InsertTask;
