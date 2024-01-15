// Login.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

const InsertArticle = () => {
    const [articleTitle, setArticleTitle] = useState('');
    const [articleDescription, setArticleDescription] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTagOptions, setSelectedTagOptions] = useState('');
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
        })
          .then(response => {
            setCategoryOptions(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
        // Ambil data kategori dari endpoint
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tag`, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
        })
          .then(response => {
            setTagOptions(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching tags:', error);
          });
    }, []);

    // console.log(user);
    const handleSubmit = async (event) => {
        event.preventDefault();

        const newData = {
            user_id:user.user_id,
            article_title:articleTitle,
            article_description:articleDescription,
            category_id:selectedCategory,
            tag_id: selectedTagOptions
          };
        console.log("###########",newData);
                
        try {
            // Melakukan operasi INSERT ke tabel tasks
            const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/article`,
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
                    <label htmlFor="articleTitle" className="form-label">
                        Article Title:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="articleTitle"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="articleDescription" className="form-label">
                        Description:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="articleDescription"
                        value={articleDescription}
                        onChange={(e) => setArticleDescription(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="position" className="form-label">
                        Category:
                    </label>
                    <select
                        className="form-select"
                        id="Category"
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
                    <label htmlFor="tag" className="form-label">
                        Tag:
                    </label>
                    <select
                        className="form-select"
                        id="tag"
                        value={selectedTagOptions}
                        onChange={(e) => setSelectedTagOptions(e.target.value)}
                    >
                        <option value="">Select Tag</option>
                        {tagOptions.map((tag) => (
                            <option key={tag.tag_id} value={tag.tag_id}>
                                {tag.tag_name}
                            </option>
                        ))}
                    </select>
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

export default InsertArticle;
