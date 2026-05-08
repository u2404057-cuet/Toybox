async function test() {
  try {
    const loginRes = await fetch('http://localhost:5001/api/auth/login', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email: 'admin@toybox.com', password: 'admin123' }) 
    });
    const loginData = await loginRes.json();
    if (!loginData.success) throw new Error(loginData.error.message);
    const token = loginData.data.token;
    console.log("Token received");

    const dashRes = await fetch('http://localhost:5001/api/admin/dashboard', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    const dashData = await dashRes.json();
    console.log("Dashboard Success:", dashData);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
