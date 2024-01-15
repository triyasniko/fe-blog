import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

const UpdateArticle = () => {
    const [articleTitle, setArticleTitle] = useState('');
    const [articleDescription, setArticleDescription] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [status, setStatus]=useState('');
    const navigate=useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const { articleId } = useParams(); 
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

    const fetchDataCategoryOptions=()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
        })
          .then(response => {
            setCategoryOptions(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching category:', error);
          });
    };

    const fetchDataTagOptions=()=>{
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
    }

    const fetchArticleDetails = async (articleId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/article/${articleId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const articleDetails = response.data.data[0]; // Adjust based on your API response structure
            console.log(articleDetails,"########");
            // Set state with task details
            setArticleTitle(articleDetails.article_title);
            setArticleDescription(articleDetails.article_description);
            const categoryIdPrevious = response.data.data[0].category_id; 
            setSelectedCategory(categoryIdPrevious);
            const tagIdPrevious = response.data.data[0].tag_id;
            setSelectedTag(tagIdPrevious);
        } catch (error) {
            console.error('Error fetching article details:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const newData = {
            user_id:user.user_id,
            article_title:articleTitle,
            article_description:articleDescription,
            category_id:selectedCategory,
            tag_id: selectedTag
          };
        console.log("###########",newData);
                
        try {
            // Melakukan operasi INSERT ke tabel tasks
            const response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/article/${articleId}`,
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
        fetchDataCategoryOptions();
        fetchDataTagOptions();
        fetchArticleDetails(articleId);
    }, [articleId]);
    return (
        <>
        <Container>
            <form onSubmit={handleUpdate} className="mt-4">
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
                    <label htmlFor="companysector" className="form-label">
                        Tag:
                    </label>
                    <select
                        className="form-select"
                        id="companysector"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <option value="">Select Company Sector</option>
                        {tagOptions.map((tag) => (
                            <option key={tag.tag_id} value={tag.tag_id}>
                                {tag.tag_name}
                            </option>
                        ))}
                    </select>
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
export default UpdateArticle;
