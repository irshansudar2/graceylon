/* ==========================================================================
   0. CONFIGURATION & INTEGRATIONS
   ========================================================================== */
// Web3Forms Access Key: Enter your free key here to receive Tasting Circle newsletter email alerts.
// Get yours instantly at https://web3forms.com/ (No account required, key sent to your inbox).
// Keeps your personal email address safe from public website spam scrapers!
const WEB3FORMS_ACCESS_KEY = "1594ac6d-acd2-43c0-bc44-c54521ace1a9";


document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & SCROLL HIGHLIGHT
     ========================================================================== */
  const header = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Highlight navigation links on scroll using Intersection Observer
  const scrollObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollObserverOptions);

  sections.forEach(section => navObserver.observe(section));


  /* ==========================================================================
     2. MOBILE MENU NAVIGATION
     ========================================================================== */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const menuIconOpen = document.getElementById('menuIconOpen');
  const menuIconClose = document.getElementById('menuIconClose');

  function toggleMobileMenu() {
    const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
    navLinksContainer.classList.toggle('active');

    if (isExpanded) {
      menuIconOpen.style.display = 'block';
      menuIconClose.style.display = 'none';
    } else {
      menuIconOpen.style.display = 'none';
      menuIconClose.style.display = 'block';
    }
  }

  mobileNavToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });


  /* ==========================================================================
     3. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, revealObserverOptions);

  reveals.forEach(el => revealObserver.observe(el));


  /* ==========================================================================
     4. SHOPPING CART STATE MANAGEMENT
     ========================================================================== */
  let cart = [];
  const SHIPPING_THRESHOLD = 100.00;

  // DOM Elements
  const cartOverlay = document.getElementById('cartOverlay');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartEmptyMessage = document.getElementById('cartEmptyMessage');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartShipping = document.getElementById('cartShipping');
  const cartTotal = document.getElementById('cartTotal');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const shippingProgressText = document.getElementById('shippingProgressText');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Checkout Modal
  const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Load cart from Local Storage
  function loadCart() {
    const savedCart = localStorage.getItem('graceylon_cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        cart = [];
      }
    }
    updateCartDOM();
  }

  // Save cart to Local Storage
  function saveCart() {
    localStorage.setItem('graceylon_cart', JSON.stringify(cart));
  }

  // Open & Close Drawer
  function openCartDrawer() {
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeCartDrawer() {
    cartOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  cartOpenBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCartDrawer();
  });

  // Core Add item function
  function addToCart(id, name, price, img, category) {
    const parsedPrice = parseFloat(price);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price: parsedPrice,
        img,
        category,
        quantity: 1
      });
    }

    saveCart();
    updateCartDOM();
    showToast(`Added ${name} to your tasting flight`, 'success');
  }

  // Update item quantity
  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    updateCartDOM();
  }

  // Remove item entirely
  function removeFromCart(id) {
    const item = cart.find(item => item.id === id);
    const itemName = item ? item.name : '';
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDOM();
    if (itemName) {
      showToast(`Removed ${itemName} from your flight`, 'info');
    }
  }

  // Calculate & Render DOM elements
  function updateCartDOM() {
    // Cart Count bubble
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Toggle Empty state visibility
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      cartItemsContainer.appendChild(cartEmptyMessage);
      if (cartSubtotal) cartSubtotal.textContent = '$0.00';
      if (cartShipping) cartShipping.textContent = '$0.00';
      if (cartTotal) cartTotal.textContent = '$0.00';
      if (shippingProgressFill) shippingProgressFill.style.width = '0%';
      if (shippingProgressText) shippingProgressText.innerHTML = `Add <span>$${SHIPPING_THRESHOLD.toFixed(2)}</span> more for complimentary global courier shipping.`;
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;

    // Clear items list (excluding hidden empty template)
    cartItemsContainer.innerHTML = '';

    let subtotalSum = 0;

    cart.forEach(item => {
      const itemSub = item.price * item.quantity;
      subtotalSum += itemSub;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <span class="cart-item-category">${item.category}</span>
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-actions">
            <div class="cart-item-qty">
              <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // Update financial sums
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotalSum.toFixed(2)}`;

    const isFreeShipping = subtotalSum >= SHIPPING_THRESHOLD;
    const shippingCost = isFreeShipping ? 0.00 : 15.00;
    if (cartShipping) cartShipping.textContent = isFreeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`;

    const grandTotal = subtotalSum + shippingCost;
    if (cartTotal) cartTotal.textContent = `$${grandTotal.toFixed(2)}`;

    // Update Shipping threshold indicator bar
    const percent = Math.min((subtotalSum / SHIPPING_THRESHOLD) * 100, 100);
    if (shippingProgressFill) shippingProgressFill.style.width = `${percent}%`;

    if (isFreeShipping) {
      if (shippingProgressText) shippingProgressText.innerHTML = `🌟 <strong>Congratulations!</strong> You qualify for free global courier shipping.`;
      if (shippingProgressFill) shippingProgressFill.style.background = 'hsl(var(--accent-cyan))';
    } else {
      const remaining = SHIPPING_THRESHOLD - subtotalSum;
      if (shippingProgressText) shippingProgressText.innerHTML = `Add <span>$${remaining.toFixed(2)}</span> more for complimentary global courier shipping.`;
      if (shippingProgressFill) shippingProgressFill.style.background = 'hsl(var(--accent-cyan))';
    }

    // Attach event listeners to newly rendered items button elements
    attachCartItemEventListeners();
  }

  function attachCartItemEventListeners() {
    document.querySelectorAll('.dec-qty').forEach(btn => {
      btn.onclick = (e) => updateQuantity(e.target.dataset.id, -1);
    });

    document.querySelectorAll('.inc-qty').forEach(btn => {
      btn.onclick = (e) => updateQuantity(e.target.dataset.id, 1);
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.onclick = (e) => removeFromCart(e.target.dataset.id);
    });
  }

  // Hook product CTA clicks
  document.querySelectorAll('.add-cart-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const { id, name, price, img, category } = target.dataset;
      addToCart(id, name, price, img, category);
    });
  });

  document.querySelectorAll('.add-cart-instant-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const { id, name, price, img, category } = target.dataset;
      addToCart(id, name, price, img, category);
      openCartDrawer();
    });
  });

  // Simulated Quote Request Logic
  const cartQuoteEmail = document.getElementById('cartQuoteEmail');

  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;

    const email = cartQuoteEmail ? cartQuoteEmail.value.trim() : '';
    if (!email) {
      showToast('Please enter your email to request a quote.', 'info');
      if (cartQuoteEmail) cartQuoteEmail.focus();
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'info');
      if (cartQuoteEmail) cartQuoteEmail.focus();
      return;
    }

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Requesting Quote...';

    // Build cart items description for email body
    const itemsList = cart.map(item => `  - ${item.name} (${item.category}) | Quantity: ${item.quantity}`).join('\n');
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    let sentSuccessfully = false;

    // Check if Web3Forms key is configured
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
            subject: `New grá CEYLON Quote Request from ${email}`,
            from_name: "grá CEYLON Website",
            email: email,
            message: `A client has requested a bespoke luxury quote!

Details:
- Client Email: ${email}
- Total Items: ${totalItemsCount}

Requested Treasures:
${itemsList}

Please review their selection and reach out with a curated premium quote within 24 hours.`,
          }),
        });

        const result = await response.json();
        if (response.status === 200 && result.success) {
          sentSuccessfully = true;
        } else {
          console.error("Web3Forms Quote Request API Error:", result.message);
        }
      } catch (error) {
        console.error("Failed to post quote request via Web3Forms API:", error);
      }
    } else {
      // Fallback simulation mode
      console.warn("Web3Forms Access Key not set. Simulating luxury quote request registry.");
      await new Promise(resolve => setTimeout(resolve, 1800));
      sentSuccessfully = true;
    }

    // Clear Cart state
    cart = [];
    saveCart();

    // Clear email field
    if (cartQuoteEmail) cartQuoteEmail.value = '';

    updateCartDOM();
    closeCartDrawer();

    // Reset button
    checkoutBtn.textContent = 'Request Quote';
    checkoutBtn.disabled = false;

    // Customize success modal dynamically for Quote request
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.querySelector('.modal-desc');
    if (modalTitle) modalTitle.textContent = 'Quote Requested';
    if (modalDesc) modalDesc.textContent = `Thank you for embarking on this sensory journey. Your custom request has been received. Our luxury curators will review your selection and send a private quote to ${email} within 24 hours.`;

    // Trigger Success modal popup
    checkoutModalOverlay.classList.add('active');
  });

  modalCloseBtn.addEventListener('click', () => {
    checkoutModalOverlay.classList.remove('active');
  });


  /* ==========================================================================
     5. SENSORY TEA SELECTOR (QUIZ LOGIC)
     ========================================================================== */
  let quizStep = 1;
  const totalQuizSteps = 3;
  const quizSelections = {};

  const quizContainer = document.getElementById('quizContainer');
  const quizPrevBtn = document.getElementById('quizPrevBtn');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizFooter = document.getElementById('quizFooter');

  const stepElements = document.querySelectorAll('.quiz-step');

  if (quizContainer && quizNextBtn && quizPrevBtn) {
    // Option Click selector
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const parentStep = option.closest('.quiz-step');
        const stepNum = parseInt(parentStep.dataset.step);

        // Remove selection from siblings in the same step
        parentStep.querySelectorAll('.quiz-option').forEach(sib => sib.classList.remove('selected'));

        // Select clicked
        option.classList.add('selected');

        // Save data
        quizSelections[stepNum] = option.dataset.value;

        // Enable next action
        quizNextBtn.disabled = false;

        // Visual feedback highlight
        showToast(`Selected: ${option.querySelector('.quiz-option-text').textContent}`, 'info');
      });
    });

    // Navigations
    quizNextBtn.addEventListener('click', () => {
      if (quizStep < totalQuizSteps) {
        transitionStep(quizStep, quizStep + 1);
        quizStep++;
        updateQuizProgress();
      } else {
        calculateAndShowResult();
      }
    });

    quizPrevBtn.addEventListener('click', () => {
      if (quizStep > 1) {
        transitionStep(quizStep, quizStep - 1);
        quizStep--;
        updateQuizProgress();
      }
    });
  }

  function transitionStep(from, to) {
    const fromEl = document.querySelector(`.quiz-step[data-step="${from}"]`);
    const toEl = document.querySelector(`.quiz-step[data-step="${to}"]`);

    fromEl.classList.remove('active');

    setTimeout(() => {
      // Check if next step already has a selection to toggle next button state
      const hasSelection = !!quizSelections[to];
      quizNextBtn.disabled = !hasSelection;

      if (to === totalQuizSteps) {
        quizNextBtn.textContent = 'Reveal Match';
      } else {
        quizNextBtn.textContent = 'Continue';
      }

      quizPrevBtn.disabled = to === 1;

      toEl.classList.add('active');
    }, 200);
  }

  function updateQuizProgress() {
    const pct = ((quizStep - 1) / (totalQuizSteps - 1)) * 100;
    quizProgressFill.style.width = `${Math.max(pct, 10)}%`;
  }

  // Quiz calculations and templates loading
  function calculateAndShowResult() {
    quizContainer.style.opacity = 0;
    quizFooter.style.opacity = 0;
    quizProgressFill.style.width = '100%';

    setTimeout(() => {
      const mood = quizSelections[1];
      const sensory = quizSelections[2];
      const time = quizSelections[3];

      let recommended = {
        id: 'gr-silvertips',
        name: 'Royal Silver Tips',
        price: '48.00',
        img: 'assets/silver_tips.png',
        category: 'White Tea',
        desc: 'Sourced from misty 6,000ft elevations. Sunlight-cured velvet buds that release a bright, floral infusion, matching your preference for premium, light-bodied restoration.'
      };

      // Simple branching quiz outcome logic
      if (mood === 'calm' || sensory === 'spicy' || time === 'evening') {
        recommended = {
          id: 'gr-cinnamon',
          name: 'Wild Cinnamon Rose',
          price: '32.00',
          img: 'assets/cinnamon.png',
          category: 'Botanical Infusion',
          desc: 'Our single-origin warm botanical blend. Soft pink rosebuds and therapeutic Ceylon cinnamon bark bring the perfect earthy, comforting warmth to your twilight rituals.'
        };
      } else if (mood === 'restored' || sensory === 'earthy' || time === 'midnight') {
        recommended = {
          id: 'gr-wellnessoil',
          name: 'Royal Elixir Spa Oil',
          price: '64.00',
          img: 'assets/wellness_oil.png',
          category: 'Wellness Elixir',
          desc: 'A pure botanical oil powerhouse. Sourced from high-altitude estates, infused with powerful black tea polyphenols to nourish body and soul during your moments of sanctuary.'
        };
      }

      quizContainer.innerHTML = `
        <div class="quiz-result reveal active">
          <span class="section-label" style="display:inline-flex;">Your Perfect Alignment</span>
          
          <div class="quiz-result-recommendation">
            <img src="${recommended.img}" alt="${recommended.name}" class="quiz-result-image">
            <span class="product-category" style="margin-bottom: 0.5rem; display:block;">${recommended.category}</span>
            <h3 class="quiz-result-name">${recommended.name}</h3>
            <p style="font-size: 0.85rem; max-width: 400px; margin: 0 auto 1.5rem auto;">${recommended.desc}</p>
            
            <button class="btn btn-primary" id="quizAddBtn" 
              data-id="${recommended.id}" 
              data-name="${recommended.name}" 
              data-price="${recommended.price}" 
              data-img="${recommended.img}" 
              data-category="${recommended.category}"
              style="padding: 0.8rem 1.8rem;">
              Add and Indulge Now
            </button>
          </div>
          
          <button class="quiz-nav-btn" id="quizRestartBtn" style="margin: 0 auto; display:flex;">
            Restart Ritual
          </button>
        </div>
      `;

      // Hide footer, display container
      quizFooter.style.display = 'none';
      quizContainer.style.opacity = 1;

      // Handle add action
      const quizAddBtn = document.getElementById('quizAddBtn');
      quizAddBtn.onclick = () => {
        addToCart(
          quizAddBtn.dataset.id,
          quizAddBtn.dataset.name,
          quizAddBtn.dataset.price,
          quizAddBtn.dataset.img,
          quizAddBtn.dataset.category
        );
        openCartDrawer();
      };

      // Restart ritual hooks
      document.getElementById('quizRestartBtn').onclick = resetQuiz;
    }, 400);
  }

  function resetQuiz() {
    quizStep = 1;
    quizProgressFill.style.width = '33.3%';
    quizFooter.style.display = 'flex';
    quizFooter.style.opacity = 1;
    quizPrevBtn.disabled = true;
    quizNextBtn.disabled = true;
    quizNextBtn.textContent = 'Continue';

    // Clear selections
    for (let key in quizSelections) delete quizSelections[key];

    // Restore HTML form structure
    quizContainer.innerHTML = `
      <!-- Step 1 -->
      <div class="quiz-step active" data-step="1">
        <h3 class="quiz-step-title">1. What is your desired state of mind?</h3>
        <div class="quiz-options">
          <div class="quiz-option" data-value="calm">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Calm &amp; Grounded</span>
          </div>
          <div class="quiz-option" data-value="energized">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Energized &amp; Radiant</span>
          </div>
          <div class="quiz-option" data-value="restored">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Restored &amp; Balanced</span>
          </div>
          <div class="quiz-option" data-value="meditative">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Meditative &amp; Creative</span>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="quiz-step" data-step="2">
        <h3 class="quiz-step-title">2. Choose your preferred aroma &amp; taste?</h3>
        <div class="quiz-options">
          <div class="quiz-option" data-value="floral">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Silky &amp; Floral</span>
          </div>
          <div class="quiz-option" data-value="spicy">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Warm &amp; Spicy</span>
          </div>
          <div class="quiz-option" data-value="earthy">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Fresh &amp; Earthy</span>
          </div>
          <div class="quiz-option" data-value="sweet">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Honey &amp; Nectar</span>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="quiz-step" data-step="3">
        <h3 class="quiz-step-title">3. When do you wish to indulge?</h3>
        <div class="quiz-options">
          <div class="quiz-option" data-value="morning">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Sunrisen Mornings</span>
          </div>
          <div class="quiz-option" data-value="midday">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Midday Sanctuary</span>
          </div>
          <div class="quiz-option" data-value="evening">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Evening Twilight</span>
          </div>
          <div class="quiz-option" data-value="midnight">
            <div class="quiz-option-dot"></div>
            <span class="quiz-option-text">Midnight Solitude</span>
          </div>
        </div>
      </div>
    `;

    // Reattach listeners to new options
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const parentStep = option.closest('.quiz-step');
        const stepNum = parseInt(parentStep.dataset.step);
        parentStep.querySelectorAll('.quiz-option').forEach(sib => sib.classList.remove('selected'));
        option.classList.add('selected');
        quizSelections[stepNum] = option.dataset.value;
        quizNextBtn.disabled = false;
        showToast(`Selected: ${option.querySelector('.quiz-option-text').textContent}`, 'info');
      });
    });
    quizContainer.style.opacity = 1;
  }


  /* ==========================================================================
     6. CUSTOM TESTIMONIAL SLIDER CAROUSEL
     ========================================================================== */
  const slider = document.getElementById('testimonialSlider');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoRotateInterval;

  if (slider && dots.length > 0) {
    function goToSlide(index) {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');

      slider.style.transform = `translateX(-${index * 100}%)`;
      currentSlide = index;
    }

    // Click handler for navigation dots
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        clearInterval(autoRotateInterval); // Stop automatic rotation once user interacts
        const index = parseInt(e.target.dataset.index);
        goToSlide(index);
        startAutoRotate(); // Restart timer
      });
    });

    // Automated rotation
    function startAutoRotate() {
      autoRotateInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % dots.length;
        goToSlide(nextSlide);
      }, 6500);
    }

    startAutoRotate();
  }


  /* ==========================================================================
     7. PREMIUM TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Choose inline icon based on message type
    const icon = type === 'success' ? '🏺' : '✨';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger paint to enable transition
    setTimeout(() => toast.classList.add('active'), 10);

    // Fade and remove
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }


  /* ==========================================================================
     8. NEWSLETTER RESRVATION CAPTURE FORM
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmailInput = document.getElementById('newsletterEmailInput');
  const newsletterSubmitBtn = document.getElementById('newsletterSubmitBtn');

  if (newsletterForm && newsletterEmailInput && newsletterSubmitBtn) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterEmailInput.value;
      if (!email) return;

      newsletterSubmitBtn.disabled = true;
      newsletterSubmitBtn.textContent = 'Securing Access...';

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
              subject: `New grá CEYLON Tasting Circle Newsletter Signup: ${email}`,
              from_name: "grá CEYLON Website",
              email: email,
              message: `A new member has signed up for the grá CEYLON Tasting Circle newsletter!

  Details:
  - Email Address: ${email}
  - Sourcing Allocation: Tasting Circle General List`,
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
        console.warn("Web3Forms Access Key not set. Simulating Tasting Circle registry.");
        await new Promise(resolve => setTimeout(resolve, 1200));
        emailSentSuccessfully = true;
      }

      showToast('🌟 Access Secured. Welcome to the grá CEYLON Tasting Circle.', 'success');
      newsletterEmailInput.value = '';
      newsletterSubmitBtn.disabled = false;
      newsletterSubmitBtn.textContent = 'Join The Circle';
    });
  }


  /* ==========================================================================
     INITIALIZATION BOOTSTRAP
     ========================================================================== */
  loadCart();

});
