import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [render,setRender]=useState(false)
  useEffect(() => {
    axios
      .get('http://localhost:8081/')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [render]);

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setNewStudent({ name: student.Name, email: student.Email });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8081/delete/${id}`)
      .then(() => {
        setData(data.filter((student) => student.id !== id));
      })
      .catch(() => {
        alert('Failed to delete student');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const resetForm = () => {
    setNewStudent({ name: '', email: '' });
    setIsEditing(false);
    setCurrentStudent(null);
    setRender(!render)
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const apiUrl = isEditing ? `http://localhost:8081/edit/${currentStudent.id}` : 'http://localhost:8081/create';
    const requestMethod = isEditing ? axios.put : axios.post;

    requestMethod(apiUrl, newStudent)
      .then((response) => {
        if (isEditing) {
          setData(data.map((student) => (student.id === currentStudent.id ? response.data : student)));
        } else {
          setData([...data, response.data]);
        }
        handleModalClose();
      })
      .catch(() => {
        alert(isEditing ? 'Failed to update student' : 'Failed to create student');
      });
  };

  const renderModal = () => (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Student' : 'Add New Student'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleModalClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
            <button type="submit" className="btn btn-success" >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><h1 className="text-danger">{error}</h1></div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student List</h1>
      <div className="d-flex justify-content-end">
        <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
          Add Student
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.Name}</td>
                <td>{student.Email}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
          <form onSubmit={handleSubmit} >

      {showModal && renderModal()}
          </form>
    </div>
  );
}

export default Home;
