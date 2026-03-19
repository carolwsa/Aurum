import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// 1. Configuração base da API
const API_BASE_URL = "http://localhost:3000/api"; // URL da sua API futura (ajuste quando pronta, ex.: 'https://minhaapi.com/api')

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tempo limite para resposta (10 segundos)
  headers: {
    "Content-Type": "application/json", // Tipo de conteúdo padrão
  },
});

// 2. Interceptores (opcional, mas útil para autenticação automática)
// Intercepta todas as respostas para verificar erros globais
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado: redirecionar para login ou renovar token
      console.log("Token expirado, faça logout ou renove o token");
    }
    return Promise.reject(error);
  },
);

// 3. Funções para gerenciar tokens (importante para autenticação)
export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem("authToken", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Adiciona token em todas as requisições futuras
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("authToken");
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem("authToken");
  delete api.defaults.headers.common["Authorization"];
};

// 4. Funções para os endpoints da API (preparadas para quando a API estiver pronta)
// Exemplo: Login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data; // Supondo que a API retorne token e dados do usuário
    await setAuthToken(token); // Salva o token
    return { success: true, user, message: "Login realizado com sucesso!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao fazer login.",
    };
  }
};

// Exemplo: Cadastro
export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return { success: true, message: "Cadastro realizado com sucesso!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao fazer cadastro.",
    };
  }
};

// Exemplo: Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout"); // Chama a rota de logout na API
    await removeAuthToken(); // Remove o token local
    return { success: true, message: "Logout realizado com sucesso!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao fazer logout.",
    };
  }
};

// Exemplo: Obter dados do usuário logado
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me"); // Rota para obter usuário atual
    return { success: true, user: response.data.user };
  } catch (error: any) {
    return { success: false, message: "Erro ao obter usuário." };
  }
};

// 5. Função para verificar se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token; // Retorna true se houver token
};
