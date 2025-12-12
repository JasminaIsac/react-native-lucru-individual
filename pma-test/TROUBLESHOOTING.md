# 🚀 Project Management App - Troubleshooting Guide

## Issues Rezolvate

### ✅ 1. Context Errors
- **Problem**: "Cannot read property 'projects' of undefined"
- **Solution**: Adăugat toți providerii în RootLayout cu error handling
- **Fișier**: `app/_layout.js`

### ✅ 2. Route Errors
- **Problem**: "No route named 'categories' exists"
- **Solution**: 
  - Corectate paths-urile de navigare (relative paths)
  - Șterse rute care nu aveau fișiere corespunzătoare
- **Fișiere**: 
  - `app/(tabs)/(projects)/_layout.js`
  - `app/(tabs)/(projects)/index.js`

---

## 📋 Quick Reference - Structura Aplicației

### Providers Hierarchy
```
AuthProvider (bottom - loaded first)
  ↓
UserProvider
  ↓
ProjectsProvider
  ↓
TasksProvider
  ↓
RootStack (top - rendered last)
```

### Route Structure
```
app/
├── _layout.js (RootLayout - cu toți providerii)
├── login.js
└── (tabs)/
    ├── _layout.js (TabsLayout)
    ├── dashboard.js
    ├── (projects)/
    │   ├── _layout.js (Stack Navigator)
    │   ├── index.js
    │   ├── add.js
    │   ├── view/[id].js
    │   ├── edit/[id].js
    │   ├── members/[id].js
    │   └── categories/
    │       └── index.js
    ├── (tasks)/
    │   ├── _layout.js
    │   ├── index.js
    │   ├── add.js
    │   ├── view/[id].js
    │   ├── edit/[id].js
    │   └── messages/[id].js
    └── (users)/
        ├── _layout.js
        ├── index.js
        ├── add.js
        ├── view/[id].js
        └── edit/[id].js
```

---

## 🧪 Testing Checklist

- [ ] App loads without errors
- [ ] Login/Logout works
- [ ] Navigation la projects, tasks, users funcționează
- [ ] Projects → Categories button navighează corect
- [ ] Add/Edit/Delete operații funcționează
- [ ] Context data se propagă corect

---

## 📝 Best Practices

### 1. **Navigation**
```javascript
// ✅ CORECT - Relative path
router.push('add')
router.push(`view/${id}`)

// ❌ GREȘIT - Full path (evita)
router.push('/(tabs)/(projects)/add')
```

### 2. **Context Usage**
```javascript
// ✅ CORECT - Cu check
try {
  const { projects } = useProjects();
  // use projects
} catch (error) {
  console.error('ProjectsProvider missing');
}

// ❌ GREȘIT - Fără check
const { projects } = useProjects(); // Poate da undefined
```

### 3. **Errors Handling**
```javascript
// ✅ CORECT
try {
  const data = await api.call();
  setData(data);
} catch (error) {
  setError(error.message);
  setData([]); // Fallback value
}

// ❌ GREȘIT
const data = await api.call();
setData(data); // Ce dacă fail?
```

---

## 🔍 Debugging Commands

```bash
# Clear bundler cache
npm run start -- --clear

# View logs
npm run android -- --verbose

# Check routes
expo router --debug
```

---

## 📞 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Route not found" | Path greșit | Folosește relative paths |
| "undefined property" | Provider missing | Verifica nesting în `_layout.js` |
| "API error" | Token expired | Check SecureStore pentru token |
| "Blank screen" | Loading state | Verifica loading flags |

