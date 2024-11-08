import { useEffect, useState, useContext } from 'react';
import { Button, Card, Row, Col, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function Workouts() {
    const { user } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState("");
    const [newWorkoutDuration, setNewWorkoutDuration] = useState("");
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
    const [updatedWorkoutName, setUpdatedWorkoutName] = useState("");
    const [updatedWorkoutDuration, setUpdatedWorkoutDuration] = useState("");
    const notyf = new Notyf();
    const navigate = useNavigate();

    // Fetch workouts from the backend
    const fetchWorkouts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/getMyWorkouts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.workouts) {
                setWorkouts(data.workouts);
            } else {
                setWorkouts([]);
            }
        } catch (error) {
            notyf.error("Error fetching workouts.");
        }
    };

    useEffect(() => {
        if (user) {
            console.log(user);
            fetchWorkouts();
        }
    }, [user]);

    // Add new workout
    const handleAddWorkout = async () => {
        const token = localStorage.getItem('token');
        const newWorkout = {
            name: newWorkoutName,
            duration: newWorkoutDuration,
        };
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/addWorkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newWorkout),
            });
            const data = await response.json();
            if (data._id) {
                notyf.success('Workout added successfully!');
                setShowModal(false);
                setNewWorkoutName("");
                setNewWorkoutDuration(""); 
                fetchWorkouts();
            } else {
                notyf.error('Error adding workout.');
            }
        } catch (error) {
            notyf.error('Failed to add workout.');
        }
    };

    // Delete workout
    const handleDeleteWorkout = async (workoutId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/deleteWorkout/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.message === 'Workout deleted successfully') {
                notyf.success('Workout deleted!');
                setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout._id !== workoutId));
            } else {
                notyf.error('Failed to delete workout.');
            }
        } catch (error) {
            notyf.error('Error deleting workout.');
        }
    };

    // Update workout status to 'Completed'
    const handleCompleteWorkout = async (workoutId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/completeWorkoutStatus/${workoutId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.message === 'Workout status updated successfully') {
                notyf.success('Workout marked as completed!');
                fetchWorkouts(); // Refresh workouts list
            } else {
                notyf.error('Failed to mark workout as completed.');
            }
        } catch (error) {
            notyf.error('Error completing workout.');
        }
    };

    const handleOpenUpdateModal = (workoutId, name, duration) => {
    setSelectedWorkoutId(workoutId);
    setUpdatedWorkoutName(name);
    setUpdatedWorkoutDuration(duration);
    setShowUpdateModal(true);
    };

    // Handle updating workout
    const handleUpdateWorkout = async () => {
        const token = localStorage.getItem('token');
        const updatedWorkout = {
            name: updatedWorkoutName,
            duration: updatedWorkoutDuration,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/updateWorkout/${selectedWorkoutId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedWorkout),
            });

            const data = await response.json();
            if (data.updatedWorkout) {
                notyf.success('Workout updated successfully!');
                setShowUpdateModal(false);
                setUpdatedWorkoutName(""); // Clear inputs after successful update
                setUpdatedWorkoutDuration("");
                fetchWorkouts(); // Refresh workouts list
            } else {
                notyf.error('Error updating workout.');
            }
        } catch (error) {
            notyf.error('Failed to update workout.');
        }
    };

    return (
        <div className="workouts-page">
            <h1>My Workouts</h1>
            <Button variant="primary" id="addWorkout" onClick={() => setShowModal(true)}>
                Add New Workout
            </Button>
            <Row className="mt-4">
                {workouts.map((workout) => (
                    <Col sm={12} md={6} lg={4} key={workout._id}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>{capitalizeFirstLetter(workout.name)}</Card.Title>
                                <Card.Text>
                                    <strong>Duration:</strong> {workout.duration} minutes
                                </Card.Text>
                                <Card.Text>
                                    <strong>Date Added:</strong> {new Date(workout.dateAdded).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Status:</strong> {capitalizeFirstLetter(workout.status)}
                                </Card.Text>
                                

                                <Button
                                    variant={workout.status === 'completed' ? 'secondary' : 'warning'}
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleOpenUpdateModal(workout._id, workout.name, workout.duration)}
                                    disabled={workout.status === 'completed'}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant={workout.status === 'completed' ? 'secondary' : 'success'}
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleCompleteWorkout(workout._id)}
                                    disabled={workout.status === 'completed'}
                                >
                                    {workout.status === 'completed' ? 'Completed' : 'Mark as Complete'}
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteWorkout(workout._id)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal for adding a new workout */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Workout Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter workout name"
                                value={newWorkoutName}
                                onChange={(e) => setNewWorkoutName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration (in minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter duration"
                                value={newWorkoutDuration}
                                onChange={(e) => setNewWorkoutDuration(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddWorkout}>
                        Add Workout
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Workout Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new workout name"
                                value={updatedWorkoutName}
                                onChange={(e) => setUpdatedWorkoutName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration (in minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter new duration"
                                value={updatedWorkoutDuration}
                                onChange={(e) => setUpdatedWorkoutDuration(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateWorkout}>
                        Update Workout
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}