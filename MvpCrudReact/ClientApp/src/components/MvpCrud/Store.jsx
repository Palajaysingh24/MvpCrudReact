import React, { useEffect, useState } from "react";
import { Button, Icon, Modal, Table, Form } from "semantic-ui-react";
import axios from "axios";
import Sales from "./Sales";
import "./Crud.css";
import DividerCrud from "./DividerCrud";
const Store = () => {
  const [stores, setStores] = useState([]);
  const [RowData, SetRowData] = useState([]);

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
  const fetchStore = () => {
    //here we will get all customer data

    axios
      .get("Stores/GetStore")
      .then(({ data }) => {
        setStores(data);

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //handle submit function
  const handleSubmit = () => {
    if(!name || !address){
      alert("Name and address can not be blank")
    }
    else{                        
    axios
      .post("Stores/PostStore", {
        name: name,
        address: address,
      })
      .then((response) => {
        const result = response.data;
        fetchStore();
        hanldePostClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });}
  };
  //handle edit function
  const handleEdit = () => {
    if(!name || !address){
      alert("Name and address can not be blank")
    }
    else{                   
    axios
      .put(`Stores/PutStore/${id}`, {
        id: id,
        name: name,
        address: address,
        sales: [],
      })
      .then((response) => {
        const result = response.data;
        fetchStore();
        hanldeEditClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });}
  };
  //handle Delete Function
  const handleDelete = () => {
    axios
      .delete(`Stores/DeleteStore/${id}`)
      .then((response) => {
        const result = response.data;
        fetchStore();
        hanldeDeleteClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(RowData);
  useEffect(() => {
    fetchStore();
  }, []);
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(5);
  const maxPageNumberLimit = 5;
  const minPageNumberLimit = 0;
  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };
  const pages = [];
  for (let i = 1; i <= Math.ceil(stores.length / storesPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * storesPerPage;
  const indexOfFirstItem = indexOfLastItem - storesPerPage;
  const currentStores = stores.slice(indexOfFirstItem, indexOfLastItem);

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
  const handleLoadMore = (e) => setStoresPerPage(e.target.value);
  return (
    <div>
      <Button
        color="blue"
        className="create-button"
        onClick={() => handlePostShow()}
      >
        New Store
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
          {currentStores.map((s) => {
            return (
              <Table.Row key={s.id}>
                <Table.Cell>{s.name}</Table.Cell>
                <Table.Cell>{s.address}</Table.Cell>
                <Table.Cell>
                  <Button
                    color="yellow"
                    onClick={() => {
                      handleEditShow(SetRowData(s), setId(s.id));
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
                        SetRowData(s),
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
        <select>
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
        <Modal.Header>Create Store</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Store Name</label>
              <input
                placeholder="Enter store name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Address</label>
              <input
                placeholder="Enter store address"
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
        <Modal.Header>Edit Store</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Store Name</label>
              <input
                placeholder="Enter store name"
                defaultValue={RowData.name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Address</label>
              <input
                placeholder="Enter store address"
                defaultValue={RowData.address}
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
        <Modal.Header>Delete Store</Modal.Header>
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

export default Store;
