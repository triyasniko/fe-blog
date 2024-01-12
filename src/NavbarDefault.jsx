import React, {useState, useEffect} from 'react';
import { Navbar, Container, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavbarDefault = ({ user }) => {
    // console.log(user)
    const access_token = localStorage.getItem("access_token");
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        // Menggunakan React Router untuk mengarahkan pengguna ke halaman login (gantilah '/login' dengan path yang sesuai)
        navigate('/login');
    };
    const fetchNotifications = async () => {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification`, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
        })
          .then(response => {
            // console.log(response.data.data,"sini euyyy ##############");
            const lastFiveNotifications = response.data.data.slice(0, 5);
            setNotifications(lastFiveNotifications);
          })
          .catch(error => {
            console.error('Error fetching notifications:', error);
          });
      };
      const renderNotifications = () => {
        if (notifications.length === 0) {
          return <Dropdown.Item disabled>No Notifications</Dropdown.Item>;
        }
      
        return notifications.map(notification => (
          <Dropdown.Item key={notification.notification_id}>{notification.notification_message}</Dropdown.Item>
        ));
      };
      
      useEffect(() => {
        // Fetch notifications on component mount
        fetchNotifications();
      }, []);
      console.log(notifications, "sini euyy###");
    
    return (
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">
                <p className="pb-2 my-0 text-muted">
                    Welcome, {user ? user.name : 'Guest'}
                </p>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                <Dropdown>
                    <Dropdown.Toggle className="btn-sm border-secondary" variant="light" id="dropdown-basic">
                    Notifications
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="btn-sm">
                        {renderNotifications()}
                    </Dropdown.Menu>
                </Dropdown>
                </li>
                <li className="nav-item mx-2">
                  <Button className="btn btn-sm btn-light mb-1 border-secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </li>
              </ul>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
};

export default NavbarDefault;
