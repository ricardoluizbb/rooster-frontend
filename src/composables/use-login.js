import { api } from "../boot/axios";
import { useQuasar } from "quasar";
import router from "../router/index";
import { ref } from "vue";

export function useLogin() {
  const $q = useQuasar();
  const sendButtonLoading = ref(false);
  const email = ref("");
  const name = ref("");
  const isPwd = ref(true);
  const isPwdConfirmation = ref(true);
  const password = ref("");
  const confirmPassword = ref("");

  const sendLoginForm = async (email, password) => {
    sendButtonLoading.value = true;
    try {
      await api.post("login", {
        email: email.value,
        password: password.value,
        setCookie: true,
      });
      router.push("/");
      $q.notify({
        message: "Bem-vindo(a) ao Rooster!",
        color: "primary",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "sentiment_very_satisfied",
      });
    } catch (error) {
      $q.notify({
        message: "E-mail e/ou senha incorreta",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error",
      });
    } finally {
      sendButtonLoading.value = false;
    }
  };

  const createAccountForm = async (name, email, password, confirmPassword) => {
    sendButtonLoading.value = true;
    try {
      await api.post("registration", {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        setCookie: true,
      });
      $q.notify({
        message: "Conta criada com sucesso!",
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
    sendButtonLoading,
    email,
    name,
    isPwd,
    isPwdConfirmation,
    password,
    confirmPassword,
  };
}
