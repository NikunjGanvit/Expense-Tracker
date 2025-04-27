import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai'; // Import close icon from react-icons

const FilterForm = ({ onClose }) => {
  return (
    <div className="filter-form">
      <div className="filter-header">
        <Button variant="link" onClick={onClose} className="close-button">
          <AiOutlineClose />
        </Button>
      </div>
      <div className="filter-content">
        <Form>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select Filter Criteria</Form.Label>
            <Form.Control as="select">
              <option>Month</option>
              <option>Year</option>
              <option>Category</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.SelectFromTo">
            <Form.Label>Select From and To Dates</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control type="date" className="me-2" />
              <span>to</span>
              <Form.Control type="date" className="ms-2" />
            </div>
          </Form.Group>
          <div className="d-grid gap-2 mt-3">
            <Button variant="primary" type="submit">
              Apply Filter
            </Button>
            <Button variant="outline-secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>

      {/* CSS for FilterForm */}
      <style jsx>{`
        .filter-form {
          background-color: #fff;
          width: 400px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .filter-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .close-button {
          color: #999;
        }
        .filter-content {
          /* Define styles for form content if needed */
        }
        .d-flex span {
          margin: 0 10px;
        }
      `}</style>
    </div>
  );
};

export default FilterForm;
