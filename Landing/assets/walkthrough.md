# Walkthrough - Email Notification Integration

We have successfully integrated secure email notifications for your invitation requests and newsletter signups. 

---

## 🌟 What was accomplished

We connected all registration forms across the **grá CEYLON** landing pages to **Web3Forms**, a modern, zero-coding form handler. Web3Forms uses a secure API key, which keeps your personal email address safe and invisible to bots trying to scrape emails from your public code files.

### Modified Files

| File | Component | Change Description |
| :--- | :--- | :--- |
| [coming-soon.js](file:///c:/Users/Irshan%20Sudar/Desktop/0-Projects/personal/coming-soon.js) | Root Page | Added configuration at the top and converted invitation submission to async POST call with rich request details. |
| [graceylon/coming-soon.js](file:///c:/Users/Irshan%20Sudar/Desktop/0-Projects/personal/graceylon/coming-soon.js) | Subdirectory Page | Connected subdirectory invitation form with simulation backup support. |
| [graceylon/index.js](file:///c:/Users/Irshan%20Sudar/Desktop/0-Projects/personal/graceylon/index.js) | Tasting Circle Page | Connected "Join the Circle" newsletter signup form to send emails to the owner. |
| [graceylon/index-full.js](file:///c:/Users/Irshan%20Sudar/Desktop/0-Projects/personal/graceylon/index-full.js) | Tasting Circle Page | Connected Tasting Circle newsletter signup in the full index version. |

---

## 🛠️ How to activate live emails (10-second setup)

To protect your user experience, the website is currently running in a **Simulation Mode** (it will simulate a network request delay, show a success toast, and successfully flip to show the membership card without throwing any console errors).

When you are ready to receive real-world email notifications:

1. Visit [web3forms.com](https://web3forms.com/) (fully free, no account registration required).
2. Enter the email address where you want to receive these invitation alerts and click **"Create Access Key"**.
3. Copy the Access Key sent to your inbox.
4. Open the JavaScript files list above and update `YOUR_WEB3FORMS_ACCESS_KEY_HERE` with your actual Access Key at the very top of each file:

```javascript
/* ==========================================================================
   0. CONFIGURATION & INTEGRATIONS
   ========================================================================== */
const WEB3FORMS_ACCESS_KEY = "your-actual-access-key-here";
```

---

## 📦 What the email notification looks like

When a user requests priority access:
- **Subject**: `New grá CEYLON Invitation Request: GRA-2026-F3C2`
- **Body**:
  ```text
  A new member has requested a private circle invitation!

  Details:
  - Email Address: customer@example.com
  - Priority ID: GRA-2026-F3C2
  - Registration Date: May 25, 2026
  - Sourcing Allocation: First Harvest Priority
  ```

When a user signs up for the general newsletter:
- **Subject**: `New grá CEYLON Tasting Circle Newsletter Signup: customer@example.com`
- **Body**:
  ```text
  A new member has signed up for the grá CEYLON Tasting Circle newsletter!

  Details:
  - Email Address: customer@example.com
  - Sourcing Allocation: Tasting Circle General List
  ```
