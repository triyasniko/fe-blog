import React,{ useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavbarDefault from './NavbarDefault';
import InsertArticle from './InsertArticle';
import Swal from 'sweetalert2';

const Home = () => {
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);

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
    const fetchDataArticle = async () => {
        try {
            // console.log(`Bearer ${access_token}`);
            const response = await axios({
                Accept: 'application/json',
                url: `${process.env.REACT_APP_API_BASE_URL}/article`,
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
             setArticles(response.data.data);
             console.log("disiniiii####",response.data);
        } catch (error) {
            // Handle errors, e.g., log the error or show a user-friendly message
            console.error("Error fetching articles data:", error);
            // You might want to redirect or handle the error in a way that makes sense for your application
        }
    };
    const handleDelete = (articleId) => {
        // Tampilkan konfirmasi sebelum menghapus
        const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    
        if (confirmDelete) {
            // Implementasi logika penghapusan article di sini
            axios.delete(`${process.env.REACT_APP_API_BASE_URL}/article/${articleId}`, {
                headers: {
                  'Authorization': `Bearer ${access_token}`
                }
              })
              .then(response => {
                // Tampilkan SweetAlert setelah penghapusan berhasil
                Swal.fire({
                  icon: 'success',
                  title: 'Article Deleted!',
                  text: `Article with ID ${articleId} has been successfully deleted.`,
                })
                .then(() => {
                    // setJobs(prevJobs => prevJobs.filter(job => job.application_id !== applicationId));
                    setArticles(prevArticles => {
                      const updatedArticles = prevArticles.filter(article => article.article_id !== articleId);
                      console.log('Updated Articles:', updatedArticles);
                      return updatedArticles;
                    });
                    
                    navigate('/');
                });
      
                // TODO: Update state atau lakukan tindakan lain setelah penghapusan berhasil
              })
              .catch(error => {
                // Tangani kesalahan saat melakukan permintaan atau kesalahan dari server
                console.error('Error during article deletion:', error.message);
      
                // Tampilkan SweetAlert jika terjadi kesalahan
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'An error occurred during article deletion.',
                });
              });
        }
      };
      const handleEdit = (articleId) => {
        // console.log(applicationId,"#@#@#@#@#@@#");
        navigate(`/editArticle/${articleId}`);
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
        fetchDataArticle();
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
                pathname: '/insertArticle',
                state: { user: user }
              }}
            
            >
                Insert  Article
            </Link>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <Card key={article.article_id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{article.article_title}</Card.Title>
                    <Card.Text>
                      <p> {article.article_description}</p>
                      <span className="text-white bg-secondary px-1">
                        {article.category_name}
                      </span>
                    </Card.Text>
                    <Button variant="outline-info" className="btn-sm mr-2" onClick={() => handleEdit(article.article_id)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" className="btn-sm" onClick={() => handleDelete(article.article_id)}>
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No articles available.</p>
            )}
        </Col>

      </Row>
    </Container>
    </>
  );
};

export default Home;
