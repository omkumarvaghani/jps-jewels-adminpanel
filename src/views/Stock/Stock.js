import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Headers/Header";

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
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  Dropdown,
  Col,
  Input,
  CardBody,
} from "reactstrap";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TableFooter,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SpinnerDotted from "../../components/Loader/loader";
import showToast from "../../components/Toast/Toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import CustomTable from "../../components/Table/Table";
import JobberSearch from "../../components/Search/Search";
import JobberPagination from "../../components/Pagination/Pagination";

const Tablelogin = () => {
  const [file, setFile] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_API;

  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countData, setCountData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [uploadFile, setUploadFile] = useState(false);
  const [fileName, setFileName] = useState();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();

      if (["csv", "xlsx", "xls"].includes(fileType)) {
        setFileName(selectedFile.name);
        setPreview(null);
      } else {
        setFileName(null);
        alert("Only .csv, .xlsx, and .xls files are allowed.");
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(`${baseUrl}/stock/students`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("File uploaded successfully!");
    } catch (error) {
      setUploadStatus("Error uploading file.");
      console.error("Error:", error);
    }
  };

  const [data, setData] = useState([]);

  const [imageUrl, setImageUrl] = useState("");

  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/stock/data`);
      if (res.status === 200) {
        setData(res.data.result.data);
        setCountData(res.data.result.TotalCount || 0);
      } else {
        console.warn("Unexpected response:", res.message);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(1);
  }, [rowsPerPage, page]);

  const filteredData = data.filter((item) => {
    return (
      item?.SKU?.toLowerCase().includes(search?.toLowerCase()) ||
      item?.Amount?.toString().includes(search?.toLowerCase()) ||
      item?.Carats?.toString().includes(search?.toLowerCase()) ||
      item?.Color?.toLowerCase().includes(search?.toLowerCase())
    );
  });

  const indexOfFirstItem = page * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [dialogData, setDialogData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = (imageSrc) => {
    setSelectedImage(imageSrc);
    setOpen(true);
  };

  const [popupData, setPopupData] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const [openRow, setOpenRow] = useState(false);

  const handleClose = () => {
    setOpenRow(false);
    setOpen(false);
    setOpenDialog(false);
    setUploadFile(false);
  };

  const handleDialogOpen = async (rowData) => {
    setOpenDialog(true);
    try {
      const response = await axios.get(
        `${baseUrl}/stock/stockpopup?SkuId=${rowData}`
      );
      if (response.status === 200) {
        setDialogData(response.data.data[0]);
      } else {
        setDialogData(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message || error);
      setDialogData(null);
    }
  };
  const handleImageClick = (imgUrl, e) => {
    setImageUrl(imgUrl); // Set the clicked image URL to state
    setOpen(true); // Open the modal
  };

  const fileModelOpen = () => {
    setUploadFile(true);
  };

  const deleteuser = async (SKU) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You want to delete this Stock?",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (willDelete) {
        const response = await axios.delete(
          `${baseUrl}/stock/deletestock/${SKU}`
        );

        if (response.status === 200) {
          toast.success("Stock deleted successfully", {
            position: "top-center",
            autoClose: 2000,
          });

          getData();
          if (data.length === 1) {
            setData([]);
          }
        } else {
          showToast.error("Failed to delete the Stock. Please try again.");
        }
      } else {
      }
    } catch (error) {
      console.error("Error deleting Stock:", error.message || error);
      showToast.error(
        "An error occurred while deleting the Stock. Please try again."
      );
      setDialogData(null);
    }
  };

  return (
    <>
      <Header />
      <Dialog open={uploadFile} style={{ padding: "11px" }}>
        <div>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              background: "rgb(201, 162, 52)",
              color: "white",
            }}
          >
            <DialogTitle
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                color: "white",
                padding: "11px",
              }}
            >
              Upload File
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
          <div style={{ padding: "11px" }}>
            <div
              className="upload-file-model"
              style={{
                border: "2px dashed #063164",
                padding: "30px",
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 block w-full p-2"
                style={{
                  display: "none", // Hiding the default file input
                }}
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="block w-full p-3 text-center rounded-lg cursor-pointer FileuploadName"
              >
                Choose File
              </label>

              {preview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Image Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-auto"
                  />
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={
                  !file ||
                  !["csv", "xlsx", "xls"].includes(
                    file.name.split(".").pop().toLowerCase()
                  )
                }
                className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 uploadBTNtoUpload"
                style={{ backgroundColor: "rgb(201, 162, 52)", border: "none" }}
              >
                Upload
              </button>
            </div>
            {fileName && (
              <div className="">
                <p className="text-sm text-gray-600 selectFileName">
                  Selected File:{" "}
                  <span className="specifiCFiel"> {fileName} </span>
                </p>
              </div>
            )}
          </div>
          {uploadStatus && (
            <p
              className=" text-gray-700"
              style={{
                fontSize: "20px",
                color: "rgb(201, 162, 52)",
                fontWeight: "600",
                padding: "11px",
              }}
            >
              {uploadStatus}
            </p>
          )}
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
        </div>
      </Dialog>

      <Container className="mt--7" fluid>
        <Card>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0 d-flex justify-content-between heading-searchflex">
                  <h3 className="mb-0 heading-right">Available Stocks</h3>
                  <div className="d-flex uploadFile-Seacrh">
                    <button
                      onClick={fileModelOpen}
                      className="UploadFIleBTNSTOCK"
                    >
                      Upload File
                    </button>
                    <div className="search-left">
                      <JobberSearch search={search} setSearch={setSearch} />
                    </div>
                  </div>
                </CardHeader>
                {loading ? (
                  <SpinnerDotted />
                ) : (
                  <CardBody>
                    <CustomTable
                      headerData={[
                        "Sr No.",
                        "Sku Id",
                        "Amount",
                        "Carates",
                        "Color",
                        "Image",
                        "Delete",
                      ]}
                      isDialog={true}
                      cellData={currentData.map((user, index) => ({
                        key: user.SKU,
                        value: [
                          indexOfFirstItem + index + 1,
                          user.SKU,
                          user.Amount,
                          user.Carats,
                          user.Color,
                          <img
                            src={user.Image}
                            alt="Image"
                            style={{ width: 50, height: 50, cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(user.Image);
                            }} // Open modal on click
                          />,
                          <i
                            className="fa-solid fa-trash"
                            style={{
                              // display: "flex",
                              // justifyContent: "center",
                              marginLeft: "20px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteuser(user.SKU); // Pass the UserId correctly
                            }}
                          ></i>,
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
        </Card>
      </Container>
      <ToastContainer />
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
        </DialogActions>
      </Dialog>

      <div style={{ width: "100%" }}>
        <Dialog
          // open={openRow}
          open={openDialog}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: "20px",
              // padding: "20px",
              maxWidth: "750px",
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
              Stock Details
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
            {popupLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <SpinnerDotted size={50} color="#4e54c8" />
              </div>
            ) : (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="detailsModel"
                >
                  <div>
                    <p>
                      <strong className="Heading">SKU:</strong>{" "}
                      {dialogData?.CertificateNo || "N/A"}{" "}
                    </p>
                    <p>
                      <strong className="Heading">Amount:</strong>{" "}
                      {dialogData?.Amount || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Certificate No:</strong>{" "}
                      {dialogData?.CertificateNo || "N/A"}
                    </p>
                    {/* <p>
                        <strong className="Heading">Color:</strong>{" "}
                        {dialogData?.Color || "N/A"}
                      </p> */}
                    <p>
                      <strong className="Heading">Discription:</strong>{" "}
                      {dialogData?.Disc || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Price:</strong>{" "}
                      {dialogData?.Price || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Symm:</strong>{" "}
                      {dialogData?.Symm || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Table:</strong>{" "}
                      {dialogData?.Table || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Tinge:</strong>{" "}
                      {dialogData?.Tinge || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Measurements:</strong>{" "}
                      {dialogData?.measurements || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">SrNo:</strong>{" "}
                      {dialogData?.SrNo || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Certificate Url:</strong>{" "}
                      <span>
                        <a
                          href={dialogData?.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4e54c8",
                            textDecoration: "underline",
                          }}
                        >
                          {/* Truncate the URL if it exceeds 10 characters */}
                          {dialogData?.certificateUrl &&
                          dialogData.certificateUrl.length > 20
                            ? dialogData.certificateUrl.substring(0, 20) + "..."
                            : dialogData?.certificateUrl || "N/A"}
                        </a>
                      </span>
                    </p>
                    <p>
                      <strong className="Heading">Video Url:</strong>{" "}
                      <span>
                        <a
                          href={dialogData?.Video}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4e54c8",
                            textDecoration: "underline",
                          }}
                        >
                          {/* Truncate the URL if it exceeds 20 characters */}
                          {dialogData?.Video && dialogData.Video.length > 20
                            ? dialogData.Video.substring(0, 20) + "..."
                            : dialogData?.Video || "N/A"}
                        </a>
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong className="Heading">Clarity:</strong>{" "}
                      {dialogData?.Clarity || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Cut:</strong>{" "}
                      {dialogData?.Cut || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Depth:</strong>{" "}
                      {dialogData?.Depth || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">EyeC:</strong>{" "}
                      {dialogData?.EyeC || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">FluoInt:</strong>{" "}
                      {dialogData?.FluoInt || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Lab:</strong>{" "}
                      {dialogData?.Lab || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Milky:</strong>{" "}
                      {dialogData?.Milky || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Polish:</strong>{" "}
                      {dialogData?.Polish || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Rap:</strong>{" "}
                      {dialogData?.Rap || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Ratio:</strong>{" "}
                      {dialogData?.Ratio || "N/A"}
                    </p>

                    <p>
                      <strong className="Heading">Shape:</strong>{" "}
                      {dialogData?.Shape || "N/A"}
                    </p>
                    <p>
                      <strong className="Heading">Sr No:</strong>{" "}
                      {dialogData?.SrNo || "N/A"}
                    </p>
                  </div>
                </div>
              </>
            )}
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
    </>
  );
};

export default Tablelogin;
