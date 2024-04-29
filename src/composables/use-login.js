import { api } from "../boot/axios";
import { useQuasar } from "quasar";
import router from "../router/index";
import { ref } from "vue";

export function useLogin() {
  const $q = useQuasar();
  const sendButtonLoading = ref(false);

  const sendLoginForm = async (email) => {
    sendButtonLoading.value = true;
    try {
      const response = await api.post("login", {
        email: email.value,
      });
      window.location.href = response.data.magicLink;
      email.value = "";
    } catch (error) {
      $q.notify({
        message: "O e-mail digitado não é cadastrado",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error",
      });
    } finally {
      sendButtonLoading.value = false;
    }
  };

  const createAccountForm = async (email) => {
    sendButtonLoading.value = true;
    try {
      await api.post("create-user", {
        email: email.value,
      });
      $q.notify({
        message: "Seu token foi gerado com sucesso!",
        color: "positive",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "check",
      });
      router.push("/login");
      email.value = "";
    } catch (error) {
      $q.notify({
        message: "Desculpe, ocorreu um erro ao tentar criar uma conta.",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error_outline",
      });
    } finally {
      sendButtonLoading.value = false;
    }
  };

  return {
    sendLoginForm,
    createAccountForm,
  };
}
