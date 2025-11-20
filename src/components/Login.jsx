import styles from "./Login.module.css";
import { useState, useContext, useEffect } from "react";
import { SessionContext } from "../context/SessionContext";
import { Field } from "@base-ui-components/react/field";
import { Form } from "@base-ui-components/react/form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";

export function Login({ value }) {
  const {
    handleSignIn,
    handleSignUp,
    session,
    sessionLoading,
    sessionMessage,
    sessionError,
  } = useContext(SessionContext);

  const navigate = useNavigate();

  // Redirect logged user
  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  const [mode, setMode] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  // Updates mode when route changes
  useEffect(() => setMode(value), [value]);

  // Toast notifications
  useEffect(() => {
    if (sessionMessage) {
      toast.success(sessionMessage, {
        position: "top-center",
        autoClose: 5000,
        style: { fontSize: "1.5rem" },
        theme: localStorage.getItem("theme"),
        transition: Bounce,
      });
    }

    if (sessionError) {
      toast.error(sessionError, {
        position: "top-center",
        autoClose: 5000,
        style: { fontSize: "1.5rem" },
        theme: localStorage.getItem("theme"),
        transition: Bounce,
      });
    }
  }, [sessionMessage, sessionError]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  const handleTogglePassword = () => setShowPassword((show) => !show);

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // Email validation
    if (!formValues.email) newErrors.email = "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formValues.email && !emailRegex.test(formValues.email))
      newErrors.email = "Invalid email format";

    // Password validation
    if (!formValues.password)
      newErrors.password = "Password is required";

    // Register validation
    if (mode === "register") {
      if (!formValues.username)
        newErrors.username = "Username is required";

      if (!formValues.confirmPassword)
        newErrors.confirmPassword = "Confirm your password";

      if (formValues.password !== formValues.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Call auth
    if (mode === "signin") {
      await handleSignIn(formValues.email, formValues.password);
    } else {
      await handleSignUp(
        formValues.email,
        formValues.password,
        formValues.username
      );
    }
  }

  return (
    <div className={styles.container}>
      <h1>{mode === "signin" ? "Sign In" : "Register"}</h1>

      <Form
        className={styles.form}
        errors={errors}
        onClearErrors={setErrors}
        onSubmit={handleSubmit}
      >
        <Field.Root name="email" className={styles.field}>
          <Field.Label className={styles.label}>Email</Field.Label>
          <Field.Control
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className={styles.input}
          />
          <Field.Error className={styles.error} />
        </Field.Root>

        {mode === "register" && (
          <Field.Root name="username" className={styles.field}>
            <Field.Label className={styles.label}>Username</Field.Label>
            <Field.Control
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              required
              className={styles.input}
            />
            <Field.Error className={styles.error} />
          </Field.Root>
        )}

        <Field.Root name="password" className={styles.field}>
          <Field.Label className={styles.label}>Password</Field.Label>

          <div className={styles.inputWrapper}>
            <Field.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleTogglePassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <Field.Error className={styles.error} />
        </Field.Root>

        {mode === "register" && (
          <Field.Root name="confirmPassword" className={styles.field}>
            <Field.Label className={styles.label}>
              Confirm Password
            </Field.Label>

            <div className={styles.inputWrapper}>
              <Field.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                className={styles.input}
              />

              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleTogglePassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <Field.Error className={styles.error} />
          </Field.Root>
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={sessionLoading}
        >
          {sessionLoading ? (
            <CircularProgress size={24} />
          ) : mode === "signin" ? (
            "Sign In"
          ) : (
            "Register"
          )}
        </button>
      </Form>

      {mode === "signin" ? (
        <button
          onClick={() => setMode("register")}
          className={styles.info}
        >
          Don't have an account? Click here!
        </button>
      ) : (
        <button
          onClick={() => setMode("signin")}
          className={styles.info}
        >
          Already have an account? Click here!
        </button>
      )}
    </div>
  );
}
