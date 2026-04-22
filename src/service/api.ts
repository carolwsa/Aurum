import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// 1. Configuração base da API
const API_BASE_URL = "http://localhost:3333"; // URL da sua API futura (ajuste quando pronta, ex.: 'https://minhaapi.com/api')

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
export const login = async (email: string, senha: string) => {
  try {
    const response = await api.post("/login", { email, senha });
    const { token, usuario } = response.data; // Supondo que a API retorne token e dados do usuário
    await setAuthToken(token); // Salva o token
    await setUserId(usuario.id);
    return { success: true, usuario, message: "Login realizado com sucesso!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Erro ao fazer login.",
    };
  }
};

// Exemplo: Cadastro
export const register = async (nome: string, email: string, senha: string) => {
  try {
    const response = await api.post("/usuarios", {
      nome,
      email,
      senha,
    });
    const { token, usuario } = response.data;
    await setAuthToken(token);
    await setUserId(usuario.id);
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

export const setUserId = async (userId: string) => {
  await AsyncStorage.setItem("userId", userId);
};

export const getUserId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("userId");
};

export const getCurrentUser = async () => {
  console.log("AUTH HEADER:", api.defaults.headers.common["Authorization"]);
  try {
    const userId = await getUserId();

    if (!userId) {
      return { success: false, message: "Usuário não identificado." };
    }

    const response = await api.get(`/usuarios/${userId}`);

    return {
      success: true,
      user: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.erro || "Erro ao obter usuário.",
    };
  }
};

export const updateUser = async (
  id: string,
  data: { nome?: string; email?: string },
) => {
  try {
    const response = await api.put(`/usuarios/${id}`, data);

    return {
      success: true,
      user: response.data.usuario,
      message: response.data.mensagem,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.erro || "Erro ao atualizar usuário.",
    };
  }
};

export const getDespesasDoMesAtual = async () => {
  try {
    const response = await api.get("/despesas/do-mes-atual");

    return {
      success: true,
      mes: response.data.mes,
      totalGasto: response.data.totalGasto,
      despesas: response.data.despesas,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.erro || "Erro ao buscar despesas do mês.",
    };
  }
};

export const getUltimas5Despesas = async () => {
  try {
    const response = await api.get("/despesas/ultimas-5/mes-atual");

    return {
      success: true,
      despesas: response.data.despesas,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.erro || "Erro ao buscar últimas despesas.",
    };
  }
};

export const getDespesasParaGrafico = async () => {
  try {
    const response = await api.get("/despesas/do-mes-atual");

    const despesas = response.data.despesas;

    // Agrupa por dia
    const map: Record<string, number> = {};

    despesas.forEach((d: any) => {
      const date = new Date(d.data).toISOString().slice(0, 10);
      map[date] = (map[date] || 0) + Number(d.valor);
    });

    const formatted = Object.entries(map).map(([date, amount]) => ({
      date,
      amount,
    }));

    return {
      success: true,
      data: formatted,
    };
  } catch {
    return {
      success: false,
      data: [],
    };
  }
};

export const getExpensesByMonth = async (month: string) => {
  const mockData = [
    {
      id: "1",
      titulo: "Lanche do IF",
      valor: 12.5,
      date: "2026-04-09",
      type: "despesa",
    },
    {
      id: "2",
      titulo: "Gasolina",
      valor: 250,
      date: "2026-04-09",
      type: "despesa",
    },
    {
      id: "3",
      titulo: "Compras farmácia",
      valor: 98.72,
      date: "2026-04-09",
      type: "despesa",
    },
    {
      id: "4",
      titulo: "Almoço",
      valor: 45,
      date: "2026-04-10",
      type: "despesa",
    },
    {
      id: "5",
      titulo: "Parcela Casa",
      valor: 4166.67,
      date: "2026-04-09",
      type: "meta",
    },
  ];

  return {
    success: true,
    data: mockData,
  };
};

export const updateExpense = async (
  id: string,
  data: {
    titulo?: string;
    valor?: number;
    data?: string;
    categoria?: string;
  },
) => {
  try {
    const response = await api.put(`/despesas/${id}`, data);
    return { success: true, despesa: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.erro || "Erro ao atualizar despesa.",
    };
  }
};

export const deleteExpense = async (id: string) => {
  try {
    await api.delete(`/despesas/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.erro || "Erro ao excluir despesa.",
    };
  }
};

export const createExpense = async (data: any) => {
  try {
    const response = await api.post("/despesas", data);

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

export const getAllExpenses = async () => {
  try {
    const mockData = [
      {
        id: 1,
        description: "Parcela Casa",
        amount: 4166.67,
        date: "2026-01-09",
        type: "meta",
      },
      {
        id: 2,
        description: "Gasolina",
        amount: 250,
        date: "2026-02-09",
        type: "despesa",
      },
      {
        id: 3,
        description: "Compras farmácia",
        amount: 98.72,
        date: "2026-03-09",
        type: "despesa",
      },
      {
        id: 4,
        description: "Almoço",
        amount: 545,
        date: "2026-04-10",
        type: "despesa",
      },
      {
        id: 5,
        description: "Parcela Casa",
        amount: 41.67,
        date: "2026-02-09",
        type: "meta",
      },
    ];
    // Na API real, você faria algo como: axios.get('/expenses?year=2026')
    // const response = await fetch("SUA_URL_DA_API/expenses");
    // const data = await response.json();

    return {
      success: true,
      data: mockData, // Espera-se um array de objetos
    };
  } catch (error) {
    return { success: false, data: [] };
  }
};

export default api;
