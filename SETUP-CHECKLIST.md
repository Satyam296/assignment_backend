# 🚀 Supabase Setup Checklist

## ✅ COMPLETED:
- [x] Converted all code from MongoDB to Supabase
- [x] Removed mongoose dependencies
- [x] Updated all controllers
- [x] Pushed to GitHub
- [x] Created schema SQL file
- [x] Created seed data SQL file

## 📝 YOUR TODO (20 minutes total):

### □ Step 1: Create Supabase Tables (5 min)
1. Go to https://supabase.com/dashboard
2. Open your project (or create new)
3. Click "SQL Editor" (left sidebar)
4. New query → paste `supabase-schema.sql` content
5. Click "Run"

### □ Step 2: Seed Database (2 min)
1. SQL Editor → New query
2. Paste `supabase-seed.sql` content
3. Click "Run"
4. You should see 3 products added

### □ Step 3: Get Credentials (2 min)
1. Project Settings → API
2. Copy **Project URL** (https://xxx.supabase.co)
3. Copy **anon public key** (starts with eyJ...)

### □ Step 4: Update Render Env Variables (5 min)
Add in Render dashboard:
```
SUPABASE_URL=<your-project-url>
SUPABASE_ANON_KEY=<your-anon-key>
```

Remove:
```
MONGODB_URI (delete this!)
```

### □ Step 5: Deploy & Test (5 min)
1. Render auto-deploys (wait 3-5 min)
2. Test: `https://your-app.onrender.com/api/health`
3. Test: `https://your-app.onrender.com/api/products`
4. Open your frontend - should work!

## 🎉 DONE!

Your backend is now running on **Supabase (PostgreSQL)**!

---

## 📱 Quick Commands to Check:

**Test Health:**
```bash
curl https://assignment-backend-1-84be.onrender.com/api/health
```

**Test Products:**
```bash
curl https://assignment-backend-1-84be.onrender.com/api/products
```

**Check Supabase Table:**
```sql
SELECT COUNT(*) FROM products;
```

Should return 3 products!
