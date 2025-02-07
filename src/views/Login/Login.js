import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment, IconButton } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      Password: "",
      primaryEmailAddress: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      primaryEmailAddress: Yup.string()
        .email("Invalid email")
        .required("Email is required")
        .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email must contain '@' and '.'"),
      Password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const [data, setData] = useState([]);
  console.log(data, "data");
  const handleSubmit = async (values) => {
    try {
      const res = await axios.post(
        `${baseUrl}/superadmin/superadminlogin`,
        {
          EmailAddress: values.primaryEmailAddress,
          Password: values.Password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res, "Full response object");
      console.log(res.data, "res.data");

      if (res.status === 200) {
        const token = res.data.token;
        let SuperadminId;

        if (res.data.superadminId) {
          SuperadminId = res.data.superadminId;
        } else if (res.data.data && res.data.data.superadminId) {
          SuperadminId = res.data.data.superadminId;
        }

        console.log(SuperadminId, "SuperadminId from response");

        if (token) {
          localStorage.setItem("authorization", token);
        }

        if (SuperadminId) {
          localStorage.setItem("id", SuperadminId);
        } else {
          console.warn("SuperadminId is missing in the response");
        }

        setData(res.data.data);
        toast.success("Login successful! Welcome!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/admin/index");
        }, 1200);
      } else {
        console.warn("Unexpected response:", res.message);
        toast.warn("Invalid Email or Password", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        formik.setFieldError("Password", "Incorrect email or password");

        toast.warn("Invalid Email or Password", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        console.error("Error during login:", error.message || error);
        toast.error("Something went wrong. Please try again!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody
            className=""
            style={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                gap: "20px",
                flexDirection: "column",
                display: "flex",
                width: "100%",
              }}
            >
              <div className="my-4">
                <img
                  src="https://jpsjewels.com/wp-content/uploads/logo.svg"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: "50px",
                    display: "flex",
                  }}
                />
              </div>
              <Form role="form" onSubmit={formik?.handleSubmit}>
                <FormGroup className="mb-3">
                  <InputGroup
                    className="input-group-alternative"
                    style={{ flexWrap: "nowrap" }}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      value={formik?.values?.primaryEmailAddress}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      invalid={
                        formik?.touched?.primaryEmailAddress &&
                        Boolean(formik?.errors?.primaryEmailAddress)
                      }
                      name="primaryEmailAddress"
                      placeholder="Primary Email"
                      type="email"
                      className=" w-100"
                      style={{ color: "black" }}
                    />
                    {formik?.touched?.primaryEmailAddress &&
                      formik?.errors?.primaryEmailAddress && (
                        <div className="text-danger mt-1">
                          {formik.errors.primaryEmailAddress}
                        </div>
                      )}
                  </InputGroup>
                </FormGroup>

                <FormGroup
                  className="text-boxes"
                  style={{
                    width: "100%",
                    marginTop: "24px",
                    position: "relative",
                  }}
                >
                  <InputGroup
                    className="input-group-alternative"
                    style={{ flexWrap: "nowrap" }}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>

                    <Input
                      value={formik?.values?.Password}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      invalid={
                        formik?.touched?.Password &&
                        Boolean(formik?.errors?.Password)
                      }
                      name="Password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      className="text-blue-color w-100"
                      autoComplete="new-password"
                      style={{
                        paddingRight: "45px",
                        color: "black",
                      }}
                    />

                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputGroup>

                  {formik?.touched?.Password && formik?.errors?.Password && (
                    <div className="text-danger mt-1">
                      {formik.errors.Password}
                    </div>
                  )}
                </FormGroup>

                <div className="text-center">
                  <Button
                    className="my-4"
                    color="primary"
                    type="submit"
                    style={{ backgroundColor: "#C9A234", border: "none" }}
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
            </div>
          </CardBody>
        </Card>
      </Col>
      <ToastContainer />
    </>
  );
};

export default Login;
