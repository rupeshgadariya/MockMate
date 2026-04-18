const api = {
    getToken: () => localStorage.getItem(CONFIG.TOKEN_KEY),
    getUser: () => JSON.parse(localStorage.getItem(CONFIG.USER_KEY) || "null"),
    setAuth: (token, user) => {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    },
    clearAuth: () => {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
    },
    isLoggedIn: () => !!localStorage.getItem(CONFIG.TOKEN_KEY),

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        try {
            const res = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            return data;
        } catch (err) {
            throw err;
        }
    },

    register: (name, email, password) =>
        api.request("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        }),

    login: (email, password) =>
        api.request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    getMe: () => api.request("/auth/me"),

    uploadResume: async (file) => {
        const token = api.getToken();
        const formData = new FormData();
        formData.append("resume", file);
        const res = await fetch(`${CONFIG.API_URL}/resume/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        return data;
    },

    getResumeInfo: () => api.request("/resume/info"),

    startInterview: (jobRole, type) =>
        api.request("/interview/start", {
            method: "POST",
            body: JSON.stringify({ jobRole, type }),
        }),

    submitAnswer: (interviewId, answer) =>
        api.request(`/interview/${interviewId}/answer`, {
            method: "POST",
            body: JSON.stringify({ answer }),
        }),

    getInterviewHistory: () => api.request("/interview/history"),

    generateAnalysis: (interviewId) =>
        api.request(`/analysis/${interviewId}`, { method: "POST" }),

    getAnalysis: (interviewId) => api.request(`/analysis/${interviewId}`),
};
