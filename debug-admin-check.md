# Admin Role Debug Guide

## Problem
Korisnik se prijavljuje ali ne dobija admin sekciju u aplikaciji.

## Dijagnostikovanje

### Korak 1: Proverite trenutno stanje
Otvorite Supabase SQL Editor i pokrenite:

```sql
-- Proverite svoje trenutne uloge
SELECT * FROM public.debug_current_user_roles();
```

### Korak 2: Proverite sve korisnike i uloge
```sql
-- Vidite sve korisnike i njihove uloge
SELECT * FROM public.debug_all_user_roles();
```

### Korak 3: Proverite auth.users tabelu
```sql
-- Proverite da li vaš korisnik postoji u auth.users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
```

## Mogući uzroci problema

### 1. Nema admin uloge u bazi
**Simptom**: `role_count = 0` ili nema 'admin' u `roles` array
**Rešenje**: Dodajte admin ulogu:

```sql
-- Zamenite 'vas@email.com' sa vašim emailom
SELECT * FROM public.ensure_admin_role('vas@email.com');
```

### 2. Aplikacija ne čita uloge iz baze
**Simptom**: `check_admin_role_result = false` iako imate admin ulogu
**Rešenje**: Problem je u aplikaciji - potrebno je da se osveži auth store

### 3. RLS politike blokiraju pristup
**Simptom**: Greške u konzoli ili prazni rezultati
**Rešenje**: Proverite RLS politike

## Brzo rešenje

Ako ste sigurni da trebate admin pristup, pokrenite:

```sql
-- 1. Pronađite svoj user_id
SELECT id, email FROM auth.users WHERE email = 'vas@email.com';

-- 2. Dodajte admin ulogu (zamenite USER_ID sa vašim ID)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID', 'admin') 
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Proverite da li je dodato
SELECT * FROM public.user_roles WHERE role = 'admin';
```

## Testiranje u aplikaciji

Nakon dodavanja admin uloge:

1. **Odjavite se** iz aplikacije
2. **Prijavite se ponovo** 
3. **Proverite konzolu** za greške
4. **Osvežite stranicu** ako je potrebno

## Dodatne provere

### Proverite auth store u aplikaciji
Otvorite Developer Tools (F12) i u Console ukucajte:

```javascript
// Proverite trenutno stanje auth store-a
console.log('Auth store state:', window.__ZUSTAND_STORE__?.auth || 'Store not found');

// Ili direktno pozovite funkciju
// (ovo radi samo ako ste na stranici aplikacije)
```

### Proverite React Query cache
```javascript
// Proverite da li su uloge učitane u React Query
console.log('Query cache:', window.__REACT_QUERY_DEVTOOLS__);
```