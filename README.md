# TapOnn  Assignment

## Install

```bash
npm install
````

## Run

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

## API Endpoints

### 1) Sign Up

```bash
curl -X POST http://localhost:3000/auth/signup 
```

### 2) Login (returns Firebase ID token)

```bash
curl -X POST http://localhost:3000/auth/login 
```

Copy the `data.idToken` from the response.

### 3) Me (Protected)

```bash
curl http://localhost:3000/auth/me ^
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

### 4) Create Blog (Protected)

```bash
curl -X POST http://localhost:3000/blogs 
```

### 5) List Blogs

```bash
curl http://localhost:3000/blogs
```



