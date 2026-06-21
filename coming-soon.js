/* ==========================================================================
   0. CONFIGURATION & INTEGRATIONS
   ========================================================================== */
// Web3Forms Access Key: Enter your free key here to receive invitation email alerts.
// Get yours instantly at https://web3forms.com/ (No account required, key sent to your inbox).
// Keeps your personal email address safe from public website spam scrapers!
const WEB3FORMS_ACCESS_KEY = "1594ac6d-acd2-43c0-bc44-c54521ace1a9";

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0.1 GOOGLE ANALYTICS EVENT TRACKING WRAPPER
     ========================================================================== */
  function trackGAEvent(eventName, params = {}) {
    console.log(`[Google Analytics Event] ${eventName}:`, params);
    
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  /* ==========================================================================
     1. LUXURIOUS AMBIENT PARTICLE ENGINE
     ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle settings
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('resize', () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = Math.random() * 0.4 - 0.2;
        // Warm gold colors, slightly glowing
        const goldHue = Math.random() > 0.4 ? 45 : 35; // HSL gold or amber
        this.color = `hsla(${goldHue}, 60%, ${Math.random() * 30 + 55}%, ${Math.random() * 0.4 + 0.15})`;
        this.wobble = Math.random() * Math.PI;
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.15;

        // Interaction with mouse (gentle repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }

        // Reset if out of screen
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Subtle glow effect for gold embers
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = 'rgba(197, 168, 90, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for performance
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      // Distribute particles vertically on start
      p.y = Math.random() * height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }


  /* ==========================================================================
     2. DYNAMIC COUNTDOWN TIMER (35 days starting value, resets every 5 days)
     ========================================================================== */
  // Base Epoch Date: June 1, 2026 at 00:00:00 (Sri Lankan Time / GMT+05:30)
  const epochDate = new Date('2026-06-01T00:00:00+05:30').getTime();
  
  // 5 days cycle in milliseconds
  const cycleDuration = 5 * 24 * 60 * 60 * 1000;
  
  // Starting countdown is 35 days. 
  // Since it resets back to 35 days every 5 days, the timer counts down from 35 days to 30 days.
  const baseCountdown = 30 * 24 * 60 * 60 * 1000;

  const daysVal = document.getElementById('daysVal');
  const hoursVal = document.getElementById('hoursVal');
  const minutesVal = document.getElementById('minutesVal');
  const secondsVal = document.getElementById('secondsVal');

  function updateCountdown() {
    const now = new Date().getTime();
    
    let elapsedTime = now - epochDate;
    if (elapsedTime < 0) {
      // If system clock is set before epochDate, calculate cycle alignment
      const cyclesToShift = Math.ceil(Math.abs(elapsedTime) / cycleDuration);
      elapsedTime += cyclesToShift * cycleDuration;
    }

    const elapsedInCycle = elapsedTime % cycleDuration;
    const remainingInCycle = cycleDuration - elapsedInCycle;
    
    // Total countdown time to display: 30 days + remaining time of the 5-day cycle
    const distance = baseCountdown + remainingInCycle;

    // Time calculations
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // Render with leading zeros
    const format = (num) => (num < 10 ? `0${num}` : num);

    if (daysVal && daysVal.textContent !== format(d)) {
      daysVal.textContent = format(d);
      animateDigit(daysVal);
    }
    if (hoursVal && hoursVal.textContent !== format(h)) {
      hoursVal.textContent = format(h);
      animateDigit(hoursVal);
    }
    if (minutesVal && minutesVal.textContent !== format(m)) {
      minutesVal.textContent = format(m);
      animateDigit(minutesVal);
    }
    if (secondsVal && secondsVal.textContent !== format(s)) {
      secondsVal.textContent = format(s);
      animateDigit(secondsVal);
    }
  }

  function animateDigit(element) {
    element.style.transform = 'scale(1.15)';
    element.style.color = 'hsl(var(--accent-gold))';
    element.style.transition = 'none';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.color = '#ffffff';
      element.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 100);
  }

  // Run update every second
  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ==========================================================================
     3. PRIVATE WAITING LIST CAPTURE & PREMIUM MEMBERSHIP CONVERSION
     ========================================================================= */
  const invitationSection = document.getElementById('invitationSection');
  const inviteForm = document.getElementById('inviteForm');
  const inviteEmail = document.getElementById('inviteEmail');
  const inviteSubmitBtn = document.getElementById('inviteSubmitBtn');
  const userCardEmail = document.getElementById('userCardEmail');
  const userCardId = document.getElementById('userCardId');
  const userCardDate = document.getElementById('userCardDate');

  const STORAGE_KEY_EMAIL = 'graceylon_invite_email';
  const STORAGE_KEY_ID = 'graceylon_invite_id';
  const STORAGE_KEY_DATE = 'graceylon_invite_date';

  // Check if already registered on load
  const cachedEmail = localStorage.getItem(STORAGE_KEY_EMAIL);
  const cachedId = localStorage.getItem(STORAGE_KEY_ID);
  const cachedDate = localStorage.getItem(STORAGE_KEY_DATE);

  if (cachedEmail && cachedId) {
    renderMemberCard(cachedEmail, cachedId, cachedDate || '2026-05-25');
  }

  if (inviteForm) {
    inviteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = inviteEmail.value.trim();

      if (!email) return;

      inviteSubmitBtn.disabled = true;
      inviteSubmitBtn.textContent = 'Verifying Credentials...';

      // Generate random realistic Priority ID
      const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
      const priorityId = `GRA-2026-${randomHex}`;
      const currentDateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      let emailSentSuccessfully = false;

      // Check if real Web3Forms key is configured
      if (typeof WEB3FORMS_ACCESS_KEY !== 'undefined' && WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
        try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              access_key: WEB3FORMS_ACCESS_KEY,
              subject: `New grá CEYLON Invitation Request: ${priorityId}`,
              from_name: "grá CEYLON Website",
              email: email,
              message: `A new member has requested a private circle invitation!

Details:
- Email Address: ${email}
- Priority ID: ${priorityId}
- Registration Date: ${currentDateStr}
- Sourcing Allocation: First Harvest Priority`,
            }),
          });

          const result = await response.json();
          if (response.status === 200 && result.success) {
            emailSentSuccessfully = true;
          } else {
            console.error("Web3Forms API Error:", result.message);
          }
        } catch (error) {
          console.error("Failed to post email via Web3Forms API:", error);
        }
      } else {
        // Fallback simulation mode if key is placeholder
        console.warn("Web3Forms Access Key not set. Simulating subscription registry.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        emailSentSuccessfully = true;
      }

      // Save locally to simulate DB registration
      localStorage.setItem(STORAGE_KEY_EMAIL, email);
      localStorage.setItem(STORAGE_KEY_ID, priorityId);
      localStorage.setItem(STORAGE_KEY_DATE, currentDateStr);

      // Track Google Analytics lead generation event
      trackGAEvent('generate_lead', {
        lead_id: priorityId,
        value: 1.0,
        currency: 'USD',
        form_id: 'inviteForm'
      });

      showToast('🌟 Credentials Verified. Welcome to grá CEYLON.', 'success');

      setTimeout(() => {
        renderMemberCard(email, priorityId, currentDateStr);
        showToast('🏺 Priority tasting dispatch access granted.', 'info');
      }, 1200);

      inviteSubmitBtn.disabled = false;
      inviteSubmitBtn.textContent = 'Secure Sourcing Priority';
    });
  }

  function renderMemberCard(email, id, dateStr) {
    if (userCardEmail) userCardEmail.textContent = email;
    if (userCardId) userCardId.textContent = id;
    if (userCardDate) userCardDate.textContent = dateStr;

    // Flip the lead card to reveal the gorgeous Membership card
    if (invitationSection) {
      invitationSection.classList.add('flipped');
    }
  }


  /* ==========================================================================
     4. TEASER DETAILS & TOAST RITUALS
     ========================================================================== */
  const teaserCards = document.querySelectorAll('.teaser-card');
  teaserCards.forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.card-title').textContent;
      const category = card.querySelector('.card-category').textContent;

      // Track Google Analytics select_content event
      trackGAEvent('select_content', {
        content_type: 'teaser_product',
        item_id: name,
        item_category: category
      });

      let toastMessage = `Private dispatch allocation priority active for ${name}.`;
      if (category.includes('WHITE TEA')) {
        toastMessage = `Velvety Royal Silver Tips: sunlight-cured at 6,000ft elevations. Sourcing priority active!`;
      } else if (category.includes('INFUSION')) {
        toastMessage = `Wild Cinnamon Rose: warming wood and damask floral synergy. Sourcing priority active!`;
      } else if (category.includes('ELIXIR')) {
        toastMessage = `Royal Elixir Spa Oil: active black tea polyphenols and organic jojoba oil. Sourcing priority active!`;
      }

      showToast(toastMessage, 'success');
    });
  });


  /* ==========================================================================
     5. PREMIUM TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Choose custom inline icon based on message type/contents
    let icon = '🏺';
    if (type === 'info') icon = '✨';
    if (message.includes('Verified')) icon = '🔑';
    if (message.includes('allocation')) icon = '🍂';
    if (message.includes('Cinnamon')) icon = '🌹';
    if (message.includes('Tips')) icon = '🌱';
    if (message.includes('Oil')) icon = '💧';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger repaint to enable slide-fade transition
    setTimeout(() => toast.classList.add('active'), 10);

    // Automatic fade and removal
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

});
