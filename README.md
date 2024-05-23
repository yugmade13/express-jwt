# JWT Authentication - Node.js

Framework

- Express.js

Library

- jsonwebtoken
- bcrypt
- dotenv
- nodemon

Cara instalasi

1. Buka projek dengan VSCode
2. Install dulu library yang dibutuhkan, ketik `npm install` lalu enter dan tunggu hingga selesai
3. Jalankan projeknya, ketik `npm run dev`
4. Buka file `api.rest` (sebelumnya install dulu extension Rest Client pada VSCode)

Cara menjalankan `api.rest`

1. Klik _send request_ pada ### REGISTER (berfungsi untuk register user, kita dapa registrasi beberapa user)
2. Klik _send request_ pada ### LOGIN, kita akan mendapatkan Access Token dan Redresh Token yang nantinya akan kita gunakan

`{
  "accessToken": "<random string>",
  "refreshToken": "<random string>"
}`

3. Setelah login kita bisa mengakses /users, Klik _send request_ pada ### USERS maka akan mengembalikan data users yang sudah melakukann registrasi

`[
  {
  "username": "john@gmail.com",
  "password": "<random password>"
},
...
]`

4. Acceess Token akan expired dalam waktu 30 detik, ketika Access token telah expired kita harus memperbaruinya dengan mengakses ### TOKEN. Klik _send request_ maka kita akan dapatkan Access Token baru. Access Token yang baru ini dapat kita gunakan untuk mengakses /users

5. Klik _send request_ ### Logout (ketika sudah logout kita sudah tidak bisa menggunakan Access Token dan Refresh Token karena sudah kita hapus)
