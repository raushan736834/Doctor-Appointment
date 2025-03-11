export const Specialist =
  "https://raushan736834.github.io/host_api/doctorCheckAPI.json";

import { useFormik } from "formik";
// Create empty context
const FormikContext = React.createContext({});
// Place all of what’s returned by useFormik into context
export const Formik = ({ children, ...props }) => {
  const formikStateAndHelpers = useFormik(props);
  return (
    <FormikContext.Provider value={formikStateAndHelpers}>
      {typeof children === "function"
        ? children(formikStateAndHelpers)
        : children}
    </FormikContext.Provider>
  );
};


