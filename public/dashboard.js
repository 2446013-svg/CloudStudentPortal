const token = localStorage.getItem("studentToken");

if (!token) {
    window.location.href = "/login.html";
}

async function loadDashboard() {
    try {
        const response = await fetch("/api/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.success) {
            localStorage.removeItem("studentToken");
            window.location.href = "/login.html";
            return;
        }

        const student = data.student;

        document.getElementById("studentName").textContent = student.name;
        document.getElementById("name").textContent = student.name;
        document.getElementById("studentId").textContent = student.studentId;
        document.getElementById("email").textContent = student.email;
        document.getElementById("course").textContent = student.course;
        document.getElementById("role").textContent = student.role;

        const healthResponse = await fetch("/api/health");
        const health = await healthResponse.json();

        document.getElementById("serverStatus").textContent =
            `Server Status: ${health.status}`;

    } catch (error) {
        document.getElementById("serverStatus").textContent =
            "Unable to connect to server";
    }
}

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("studentToken");
    window.location.href = "/login.html";
});

loadDashboard();
