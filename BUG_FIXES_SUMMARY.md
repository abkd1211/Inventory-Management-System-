# Bug Fixes Summary

## Date: February 1, 2026

This document outlines two critical issues identified and their resolutions.

---

## Issue #1: Authentication & Account Switching

### **The Problem**
You couldn't sign in or sign up with a different account in the same browser tab without logging out first.

### **Is This Tied to a Device or Browser?**
- **Answer**: It's tied to the **browser's localStorage**, NOT to a physical device
- This is **completely logical** and follows standard web development practices

### **How Web Authentication Works**
1. When you log in, the application stores:
   - A JWT authentication token
   - User profile data  
2. These are saved in the browser's `localStorage` (a browser-based storage system)
3. The data persists even if you close and reopen the browser
4. The data is **browser-specific** and **profile-specific** (Chrome Profile A is separate from Chrome Profile B)

### **Why You Can't Switch Accounts Without Logging Out**
The application currently:
1. Checks localStorage for an existing token on every page load
2. Automatically logs you in if a valid token exists
3. Doesn't provide a "switch account" feature

This is **normal behavior** for most web applications (Gmail, Facebook, Twitter, etc. all work this way).

### **The Solution**
To log in with a different account:
1. Click the **"Logout"** button first
2. Then you can login/signup with a different account

### **Technical Details** (for reference)
- Location of auth logic: `frontend/src/context/AuthContext.jsx`
- Storage methods used:
  - `localStorage.setItem('token', ...)` - Stores the JWT token
  - `localStorage.setItem('user', ...)` - Stores user info
  - `localStorage.removeItem(...)` - Clears data on logout

---

## Issue #2: "Item Not Found" Error When Editing Inventory

### **The Problem**
Clicking the "Edit" button on any inventory item resulted in:
```
Failed to load item: Error: Item not found or invalid data
```

### **Root Cause**
MongoDB uses `_id` as the unique identifier field for documents, but the frontend code was using `item.id` (which didn't exist). This caused:
1. Undefined IDs being passed to the navigation URL
2. The backend receiving `undefined` as the item ID
3. Failing to find any matching item in the database

### **The Fix**
Updated all references from `item.id` to `item._id` in:
- **File**: `frontend/src/pages/InventoryList.jsx`
- **Lines Changed**: 241, 258, 287, 317

#### Specific Changes:
```javascript
// BEFORE (incorrect)
<tr key={item.id}>
onClick={() => navigate(`/inventory/edit/${item.id}`)}

// AFTER (correct)
<tr key={item._id}>
onClick={() => navigate(`/inventory/edit/${item._id}`)}
```

### **Additional Improvements**
Enhanced error logging in `AddEditInventory.jsx` to help diagnose similar issues in the future:
- Added detailed console logs showing the item ID being loaded
- Added full response logging
- Added more specific error messages to identify where the failure occurs
- Improved error handling to show the actual error message to the user

---

## Testing Recommendations

After these fixes, please test:

### Authentication:
1. ✅ Log in with Account A
2. ✅ Click Logout
3. ✅ Log in with Account B (or sign up with a new account)
4. ✅ Verify the correct user data is displayed

### Inventory Editing:
1. ✅ Navigate to the Inventory page
2. ✅ Click "Edit" on any item
3. ✅ Verify the item loads correctly with all fields populated
4. ✅ Make changes and save
5. ✅ Verify changes persist after returning to the inventory list

---

## Web Development Best Practices Confirmed

### ✅ LocalStorage for Authentication
- This is the **industry standard** for client-side authentication
- Alternatives include:
  - sessionStorage (clears when browser tab closes)
  - Cookies (with HttpOnly flag for security)
  - IndexedDB (for larger data storage)

### ✅ MongoDB _id Field
- MongoDB **always** uses `_id` as the primary key
- Frontend must consistently reference `_id` when working with MongoDB documents
- Consider adding TypeScript to catch these errors at compile-time

---

## Future Recommendations

1. **Add TypeScript**: Would have caught the `item.id` vs `item._id` issue at compile time
2. **Account Switcher**: Consider adding a "Switch Account" feature if needed
3. **Better Error Messages**: The improved logging will help catch similar issues faster
4. **Data Validation**: Consider adding runtime validation to ensure required fields exist

---

## Questions?
If you have any questions about these fixes or web development patterns, feel free to ask!
