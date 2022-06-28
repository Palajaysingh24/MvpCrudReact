import React, { useEffect, useState } from "react";
import { Button, Icon, Modal, Table, Form } from "semantic-ui-react";
import axios from "axios";

//import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import DividerCrud from "./DividerCrud";

import "./Crud.css";
const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [RowData, SetRowData] = useState([]);
  const [getCustomer, setGetCustomer] = useState([]);
  const [getProduct, setGetProduct] = useState([]);
  const [getStore, setGetStore] = useState([]);

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
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [dateSold, setDateSold] = useState("");

  const [Delete, setDelete] = useState(false);
  //Id for update record and Delete
  const [id, setId] = useState("");

  const fetchSales = () => {
    //here we will get all customer data

    axios
      .get("Sales/GetSales", {
        dateSold: dateSold,
        Customer: [],
        Product: [],
        Store: [],
      })
      .then(({ data }) => {
        setSales(data);

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //handle submit function
  const handleSubmit = () => {
    axios
      .post("Sales/PostSales", {
        dateSold: dateSold,
        customerId: customerName,
        productId: productName,
        storeId: storeName,
      })
      .then((response) => {
        const result = response.data;
        fetchSales();
        hanldePostClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //handle edit function
  const handleEdit = async () => {
    await axios
      .put(`Sales/PutSales/${id}`, {
        id: id,
        dateSold: dateSold,
        customerId: customerName,
        productId: productName,
        storeId: storeName,
      })
      .then((response) => {
        const result = response.data;
        fetchSales();
        hanldeEditClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //handle Delete Function
  const handleDelete = () => {
    axios
      .delete(`Sales/DeleteSales/${id}`)
      .then((response) => {
        const result = response.data;
        fetchSales();
        hanldeDeleteClose();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //console.log(RowData)
  useEffect(() => {
    axios
      .get("Customers/GetCustomer")
      .then(({ data }) => {
        setCustomers(data);

        //console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("Products/GetProduct")
      .then(({ data }) => {
        setProducts(data);

        // console.log(data);
      })

      .catch((err) => {
        console.log(err);
      });

    axios
      .get("Stores/GetStore", {})
      .then(({ data }) => {
        setStores(data);

        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchSales();
  }, []);

  const getCustomerName = (id) => {
    const customer = customers.filter((customer) => customer.id === id);

    if (customer[0]) {
      return customer[0].name;
    }
  };

  const getProductName = (id) => {
    const product = products.filter((product) => product.id === id);
    if (product[0]) {
      return product[0].name;
    }
  };
  const getStoreName = (id) => {
    const store = stores.filter((store) => store.id === id);
    if (store[0]) {
      return store[0].name;
    }
  };
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage, setSalesPerPage] = useState(5);
  const maxPageNumberLimit = 5;
  const minPageNumberLimit = 0;
  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };
  const pages = [];
  for (let i = 1; i <= Math.ceil(sales.length / salesPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * salesPerPage;
  const indexOfFirstItem = indexOfLastItem - salesPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);
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
  const handleLoadMore = (e) => setSalesPerPage(e.target.value);

  return (
    <div>
      <Button
        color="blue"
        className="create-button"
        onClick={() => handlePostShow()}
      >
        New Sales
      </Button>

      <Table striped className="table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Store</Table.HeaderCell>
            <Table.HeaderCell>Date Sold</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentSales.map((s) => {
            return (
              <Table.Row key={s.id}>
                <Table.Cell>{getCustomerName(s.customerId)}</Table.Cell>
                <Table.Cell>{getProductName(s.productId)}</Table.Cell>
                <Table.Cell>{getStoreName(s.storeId)}</Table.Cell>
                <Table.Cell>
                  {new Date(s.dateSold).toLocaleDateString("en-US")}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="yellow"
                    onClick={() => {
                      handleEditShow(
                        setGetCustomer(getCustomerName(s.customerId)),
                        setId(s.id),
                        SetRowData(s),
                        setGetProduct(getProductName(s.productId)),
                        setGetStore(getStoreName(s.storeId))
                      );
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
        <Modal.Header>Create Sales</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Date sold</label>
              <input
                defaultValue={new Date().toLocaleDateString("en-US")}
                onChange={(e) => setDateSold(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Customer</label>

              <select onChange={(e) => setCustomerName(e.target.value)}>
                <option value={0}></option>
                {customers.map((c) => {
                  return (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </Form.Field>
            <Form.Field>
              <label>Product</label>
              <select onChange={(e) => setProductName(e.target.value)}>
                <option value={0}></option>
                {products.map((p) => {
                  return (
                    <option value={p.id} key={p.id}>
                      {p.name}
                    </option>
                  );
                })}
              </select>
            </Form.Field>
            <Form.Field>
              <label>Store</label>
              <select onChange={(e) => setStoreName(e.target.value)}>
                <option value={0}></option>
                {stores.map((s) => {
                  return (
                    <option value={s.id} key={s.id}>
                      {s.name}
                    </option>
                  );
                })}
              </select>
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
        <Modal.Header>Edit Sales</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Date sold</label>
              <input
                defaultValue={new Date(RowData.dateSold).toLocaleDateString(
                  "en-US"
                )}
                onChange={(e) => setDateSold(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Customer</label>
              <select onChange={(e) => setCustomerName(e.target.value)}>
                <option value={RowData.customerId} key={RowData.customerId}>
                  {getCustomer}
                </option>
                {customers.map((c) => {
                  return (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </Form.Field>
            <Form.Field>
              <label>Product</label>
              <select onChange={(e) => setProductName(e.target.value)}>
                <option value={RowData.productId} key={RowData.productId}>
                  {getProduct}
                </option>

                {products.map((p) => {
                  return (
                    <option value={p.id} key={p.id}>
                      {p.name}
                    </option>
                  );
                })}
              </select>
            </Form.Field>
            <Form.Field>
              <label>Store</label>
              <select onChange={(e) => setStoreName(e.target.value)}>
                <option value={RowData.storeId} key={RowData.storeId}>
                  {getStore}
                </option>
                {stores.map((s) => {
                  return (
                    <option value={s.id} key={s.id}>
                      {s.name}
                    </option>
                  );
                })}
              </select>
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

export default Sales;
