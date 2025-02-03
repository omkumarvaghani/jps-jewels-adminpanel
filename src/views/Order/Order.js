import { useEffect, useState } from "react";
import axios from "axios";
import Header from "components/Headers/Header.js";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  Button,
  Col,
  Dropdown,
  Input,
  CardBody,
} from "reactstrap";
import React from "react";
import SpinnerDotted from "../../components/Loader/loader";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../../components/Table/Table";
import JobberSearch from "../../components/Search/Search";
import JobberPagination from "../../components/Pagination/Pagination";

const Tableuser = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const [countData, setCountData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getData(1);
  }, [searchTerm, rowsPerPage, page]);

  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/billing/billingdata`);
      if (res.status === 200) {
        setData(res.data.result.data);
        setCountData(res.data.result.TotalConut || 0);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredData = data.filter((user) => {
    const fullName = `${user.FirstName} ${user.LastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      user.ContactEmail.toLowerCase().includes(search.toLowerCase()) ||
      user.Quantity.toLowerCase().includes(search.toLowerCase()) ||
      user.Price.toLowerCase().includes(search.toLowerCase()) ||
      user.SKU.toLowerCase().includes(search.toLowerCase())
    );
  });

  const indexOfFirstItem = page * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / pageItem);

  let [propertyData, setPropertyData] = useState([]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (propertyData) {
    paginatedData = propertyData?.slice(startIndex, endIndex);
  }

  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };
  const handleDialogOpen = async (rowData) => {
    setOpenDialog(true);
    try {
      const response = await axios.get(
        `${baseUrl}/billing/billingpopup?BillingId=${rowData}`
      );
      console.log(response,"response")
      if (response.status === 200) {
        setDialogData(response.data.data);
      } else {
        setDialogData(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message || error);
      setDialogData(null);
    }
  };

  const handleImageClick = (imgUrl) => {
    setImageUrl(imgUrl);
    setOpen(true);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between heading-searchflex">
                <h3 className="mb-0 heading-right">Total Orders</h3>
                <div className="search-left">
                  <JobberSearch search={search} setSearch={setSearch} />
                </div>
              </CardHeader>

              {loading ? (
                <SpinnerDotted />
              ) : (
                <CardBody>
                  <CustomTable
                    headerData={[
                      "Sr No.",
                      "Name",
                      "Email",
                      "Quantity",
                      "Price",
                      "Sku",
                      "Order Date",
                      "Image",
                    ]}
                    isDialog={true}
                    cellData={currentData.map((user, index) => ({
                      key: user.BillingId,
                      value: [
                        indexOfFirstItem + index + 1,
                        `${user.FirstName} ${user.LastName}`,
                        user.ContactEmail,
                        user.Quantity,
                        user.Price,
                        user.SKU,
                        new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }),
                        <img
                          src={user.Image}
                          alt="Image"
                          style={{ width: 50, height: 50, cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(user.Image);
                          }}
                        />,
                      ],
                    }))}
                    onDialogOpen={handleDialogOpen}
                  />
                  {/* Pagination inside the table body */}
                  <JobberPagination
                    loading={loading}
                    totalData={countData}
                    currentData={rowsPerPage}
                    dataPerPage={rowsPerPage}
                    pageItems={[10, 25, 50]}
                    page={page}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                  />
                </CardBody>
              )}
            </Card>
          </div>
        </Row>
      </Container>

      <div style={{ width: "100%" }}>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: "20px",
              maxWidth: "1000px",
              width: "100%",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
            },
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              background: "rgb(201, 162, 52)",
              borderRadius: "20px 20px 0 0",
              color: "white",
            }}
          >
            <DialogTitle
              className="cardHead-detail"
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              Order Details
            </DialogTitle>
            <IconButton
              edge="end"
              onClick={handleClose}
              aria-label="close"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <DialogContent
            style={{
              padding: "30px",
              background: "#f8f9fa",
              fontSize: "1rem",
              color: "#333",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="detailsModel"
            >
              <div>
                <h2>User Details</h2>
                <p>
                  <strong className="Heading">Name:</strong>{" "}
                  {dialogData?.[0]?.FirstName || "N/A"}{" "}
                  {dialogData?.[0]?.LastName || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Email:</strong>{" "}
                  {dialogData?.[0]?.ContactEmail || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Phone Number:</strong>{" "}
                  {dialogData?.[0]?.Phone || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Address:</strong>{" "}
                  {dialogData?.[0]?.City || "N/A"} {dialogData?.[0]?.State}{" "}
                  {dialogData?.[0]?.Country} {dialogData?.[0]?.PinCode}
                </p>
                <p>
                  <strong className="Heading">Order Date:</strong>{" "}
                  {dialogData?.[0]?.createdAt
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }).format(new Date(dialogData[0].createdAt))
                    : "N/A"}
                </p>
              </div>
              <div>
                <h2>Product Details</h2>
                <p>
                  <strong className="Heading">Quantity:</strong>{" "}
                  {dialogData?.[0]?.Quantity || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Price:</strong>{" "}
                  {dialogData?.[0]?.Price || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Carats:</strong>{" "}
                  {dialogData?.[0]?.Carats || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Color:</strong>{" "}
                  {dialogData?.[0]?.Color || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Shape:</strong>{" "}
                  {dialogData?.[0]?.Shape || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Cut:</strong>{" "}
                  {dialogData?.[0]?.Cut || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Clarity:</strong>{" "}
                  {dialogData?.[0]?.Clarity || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Lab:</strong>{" "}
                  {dialogData?.[0]?.Lab || "N/A"}
                </p>
                <p>
                  <strong className="Heading">Sku Id:</strong>{" "}
                  {dialogData?.[0]?.SKU || "N/A"}
                </p>
              </div>
            </div>
          </DialogContent>

          <DialogActions
            style={{
              background: "#f8f9fa",
              padding: "20px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleClose}
              className="hover:opacity-90"
              style={{
                background: "rgb(201, 162, 52)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "1rem",
                padding: "10px 30px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(78, 84, 200, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Close
            </button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <img
            src={imageUrl}
            alt="User"
            style={{ width: "100%", height: "auto" }} // Adjust to fit the modal
          />
        </DialogContent>
        <DialogActions
          style={{
            background: "#f8f9fa",
            padding: "20px",
            justifyContent: "center",
          }}
        >
          {/* <Button onClick={handleClose}>Close</Button> */}
          <button
            onClick={handleClose}
            className="hover:opacity-90"
            style={{
              background: "rgb(201, 162, 52)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontWeight: "600",
              fontSize: "1rem",
              padding: "10px 30px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(78, 84, 200, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            Close
          </button>
          {/* </DialogActions> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Tableuser;
