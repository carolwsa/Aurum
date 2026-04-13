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

// Exemplo: Obter gastos diários dos últimos 5 dias
export const getDailyExpenses = async () => {
  const mockData = [
    { date: "2026-04-06", amount: 200 },
    { date: "2026-04-07", amount: 150 },
    { date: "2026-04-08", amount: 300 },
    { date: "2026-04-09", amount: 250 },
    { date: "2026-04-10", amount: 100 },
  ];
  return { success: true, data: mockData };

  // try {
  //   const response = await api.get("/expenses/daily"); // Rota para obter gastos diários
  //   return { success: true, data: response.data }; // Supondo que retorne array de {date: 'YYYY-MM-DD', amount: number}
  // } catch (error: any) {
  //   return { success: false, message: "Erro ao obter gastos diários." };
  // }
};

// Exemplo: Obter últimos 5 gastos do usuário
export const getRecentExpenses = async () => {
  const mockData = [
    {
      id: "1",
      description: "Supermercado",
      amount: 180.5,
      date: "2026-04-10",
    },
    {
      id: "2",
      description: "Combustível",
      amount: 120,
      date: "2026-04-09",
    },
    {
      id: "3",
      description: "Restaurante",
      amount: 75.9,
      date: "2026-04-08",
    },
    {
      id: "4",
      description: "Farmácia",
      amount: 45.3,
      date: "2026-04-07",
    },
    {
      id: "5",
      description: "Internet",
      amount: 99.9,
      date: "2026-04-06",
    },
  ];

  return { success: true, data: mockData };

  // IMPLEMENTAÇÃO REAL FUTURA
  // try {
  //   const response = await api.get("/expenses/recent?limit=5");
  //   return { success: true, data: response.data };
  // } catch (error: any) {
  //   return {
  //     success: false,
  //     message: "Erro ao buscar gastos recentes.",
  //   };
  // }
};

export const getExpensesByMonth = async (month: string) => {
  const mockData = [
    {
      id: 1,
      description: "Lanche do IF",
      amount: 12.5,
      date: "2026-04-09",
    },
    {
      id: 2,
      description: "Gasolina",
      amount: 250,
      date: "2026-04-09",
    },
    {
      id: 3,
      description: "Compras farmácia",
      amount: 98.72,
      date: "2026-04-09",
    },
    {
      id: 4,
      description: "Almoço",
      amount: 45,
      date: "2026-04-10",
    },
  ];

  return {
    success: true,
    data: mockData,
  };
};

export const createExpense = async (data: any) => {
  try {
    const response = await api.post("/expenses", data);

    return {
      success: true,
      data: response.data,
      message: "Despesa cadastrada com sucesso!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao cadastrar despesa.",
    };
  }
};
