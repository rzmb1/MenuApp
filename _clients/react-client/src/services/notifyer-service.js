import { toast } from "react-toastify";

const options = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

function success(message, customOptions) {
  toast.success(message, { ...options, ...customOptions });
}

function warning(message, customOptions) {
  toast.warning(message, { ...options, ...customOptions });
}

function error(message, customOptions) {
  toast.error(message, { ...options, ...customOptions });
}

function info(message, customOptions) {
  toast.info(message, { ...options, ...customOptions });
}

const notifyer = {
  error: error,
  info: info,
  warning: warning,
  success: success,
};

export default notifyer;
