import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(express.json());

// Route untuk mengakses halaman utama
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const users = []; // untuk menyimpan data pengguna
let refreshTokens = []; // untuk menyimpan refresh token dari pengguna

// Fungsi untuk membuat access token
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' }); // expired dalam waktu 30 detik
};

// Fungsi untuk membuat refresh token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken);

  return refreshToken;
};

// Route untuk registrasi pengguna
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru dengan password yang telah di-hash
    users.push({ username, password: hashedPassword });

    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Route untuk login pengguna
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari pengguna berdasarkan username
    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(400).send('Credential is incorrect');
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      // Buat dan kirim access token dan refresh token
      const accessToken = generateAccessToken({ username: user.username });
      const refreshToken = generateRefreshToken({ username: user.username });
      res.json({ accessToken, refreshToken });
    } else {
      res.status(400).send('Credential is incorrect');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Route untuk merefresh token
app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).send('Refresh token is required');
  }

  if (!refreshTokens.includes(token))
    return res.status(403).send('Invalid refresh token');

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid refresh token');
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
});

// Route untuk logout pengguna
app.post('/logout', (req, res) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.status(200).send('Logged out');
});

// Middleware untuk otentikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token is required');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid access token');
    }
    
    req.user = user;
    next();
  });
};

// Contoh route yang membutuhkan otentikasi
app.get('/users', authenticateToken, (req, res) => {
  res.json(users)
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
