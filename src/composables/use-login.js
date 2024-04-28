import { api } from "../boot/axios";

export function useLogin() {
  const sendLoginForm = async (email) => {
    try {
      const response = await api.post("login", {
        email: email.value,
      });
      window.location.href = response.data.magicLink;
      email.value = "";
    } catch (error) {}
  };

  const createAccountForm = async (email) => {
    try {
      await api.post("create-user", {
        email: email.value,
      });
      email.value = "";
    } catch (error) {}
  };

  return {
    sendLoginForm,
    createAccountForm,
  };
}
