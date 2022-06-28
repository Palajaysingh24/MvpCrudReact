import React, { useEffect, useState } from "react";
import { Button, Icon, Modal, Table, Form } from "semantic-ui-react";
import axios from "axios";
import "./Crud.css";
import "./Pagination.css";
import DividerCrud from "./DividerCrud";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState([]);

  //FOr Edit Model
  const [ViewEdit, SetEditShow] = useState(false);
  const handleEditShow = () => {
    SetEditShow(true);
  };
  const hanldeEditClose = () => {
    SetEditShow(false);
  };
  //FOr Delete Model
  const [ViewDelete, SetDeleteShow] = useState(false);
  const handleDeleteShow = () => {
    SetDeleteShow(true);
  };
  const hanldeDeleteClose = () => {
    SetDeleteShow(false);
  };
  //FOr Add New Data Model
  const [ViewPost, SetPostShow] = useState(false);
  const handlePostShow = () => {
    SetPostShow(true);
  };
  const hanldePostClose = () => {
    SetPostShow(false);
  };

  //Define here local state that store the form Data
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [Delete, setDelete] = useState(false);
  //Id for update record and Delete
  const [id, setId] = useState("");

  const fetchCustomer = () => {
    //here we will get all customer data

    axios
      .get("Customers/GetCustomer")
      .then(({ data }) => {
        setCustomers(data);

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //handle submit function
  const handleSubmit = () => {
    if (!name || !address) {
      alert("Name and address can not be blank");
    } else {
      axios
        .post("Customers/PostCustomer", {
          name: name,
          address: address,
        })

        .then((response) => {
          const result = response.data;
          fetchCustomer();
          hanldePostClose();
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  //handle Edit Function
  const handleEdit = () => {
    if (!name || !address) {
      alert("Name and address can not be blank");
    } else {
      axios
        .put(`customers/Putcustomer/${id}`, {
          id: id,
          name: name,
          address: address,
          sales: [],
        })
        .then((response) => {
          const result = response.data;
          fetchCustomer();
          hanldeEditClose();
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  //handle Delete Function
  const handleDelete = () => {
    axios
      .delete(`Customers/DeleteCustomer/${id}`)
      .then((response) => {
        const result = response.data;
        fetchCustomer();
        hanldeDeleteClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Pagination
  const [currentPage, setcurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(5);
  const maxPageNumberLimit = 5;
  const minPageNumberLimit = 0;

  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
  };
  const pages = [];
  for (let i = 1; i <= Math.ceil(customers.length / customersPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * customersPerPage;
  const indexOfFirstItem = indexOfLastItem - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <Button
          color="blue"
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage == number ? "active" : null}
        >
          {number}
        </Button>
      );
    } else {
      return null;
    }
  });
  const handleLoadMore = (e) => setCustomersPerPage(e.target.value);

  useEffect(() => {
    console.log(customer);
    fetchCustomer();
  }, []);

  return (
    <div>
      <Button
        color="blue"
        className="create-button"
        onClick={() => handlePostShow()}
      >
        New Customer
      </Button>
      <Table striped className="table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentCustomers.map((s) => {
            return (
              <Table.Row key={s.id}>
                <Table.Cell>{s.name}</Table.Cell>
                <Table.Cell>{s.address}</Table.Cell>
                <Table.Cell>
                  <Button
                    color="yellow"
                    onClick={() => {
                      handleEditShow(setCustomer(s), setId(s.id));
                    }}
                  >
                    <Icon name="edit" />
                    Edit
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="red"
                    onClick={() => {
                      handleDeleteShow(
                        setCustomer(s),
                        setId(s.id),
                        setDelete(true)
                      );
                    }}
                  >
                    <Icon name="trash" />
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <ul onChange={handleLoadMore}>
        <select className="select">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </ul>
      <ul className="pageNumbers">{renderPageNumbers}</ul>

      <DividerCrud />
      <p>&copy; 2022 - Ajay Pal</p>
      {/* Modal for submit data to database */}

      <Modal open={ViewPost}>
        <Modal.Header>Create Customer</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Customer Name</label>
              <input
                placeholder="Enter customer name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Address</label>
              <input
                placeholder="Enter customer address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={hanldePostClose}>
            Cancel
          </Button>
          <Button
            content="Submit"
            labelPosition="right"
            icon="checkmark"
            onClick={handleSubmit}
            positive
          />
        </Modal.Actions>
      </Modal>

      {/* Modal for Edit customer record */}

      <Modal open={ViewEdit}>
        <Modal.Header>Edit Customer</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Customer Name</label>
              <input
                placeholder="Enter customer name"
                defaultValue={customer.name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Address</label>
              <input
                placeholder="Enter customer address"
                defaultValue={customer.address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={hanldeEditClose}>
            Cancel
          </Button>
          <Button
            content="Edit"
            labelPosition="right"
            icon="checkmark"
            onClick={handleEdit}
            positive
          />
        </Modal.Actions>
      </Modal>

      {/* Modal for deleting customer data  */}

      <Modal open={ViewDelete}>
        <Modal.Header>Delete Customer</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Are you sure?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={hanldeDeleteClose}>
            Cancel
          </Button>
          <Button
            content="Delete"
            labelPosition="right"
            icon="remove"
            onClick={handleDelete}
            negative
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Customer;
