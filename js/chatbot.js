/* ==========================================================================
   VEXORA — Premium 3D Project & Innovation Assistant
   ========================================================================== */

const Chatbot = (() => {
  let isInit = false;
  let isOpen = false;
  let hasStarted = false;

  const OPTIONS = [
    {
      id: 'stem_kits',
      label: '🔬 Science & STEM Project Kits',
      badge: 'School & College',
      reply: "We provide complete working STEM kits, physics/electronics models, working science prototypes, and verified components curated for school & college exhibitions with full documentation.",
      whatsappMsg: "Hi VEXORA! I am looking for School/College Science & STEM Project Kits. Please share your catalog, component list, and delivery details.",
      emailSubject: "STEM & Science Project Kits Enquiry — VEXORA",
      emailBody: "Hi VEXORA Team,%0D%0A%0D%0AI am reaching out regarding School/College Science & STEM Project Kits.%0D%0APlease provide available models, pricing, and turnaround time."
    },
    {
      id: 'robotics_iot',
      label: '⚡ IoT, Robotics & Engineering Hardware',
      badge: 'B.Tech / Polytech',
      reply: "From Arduino, ESP32, Raspberry Pi sensors to motor drivers, chassis, and custom wiring looms — we supply tested hardware ready for semester capstone & competition projects.",
      whatsappMsg: "Hi VEXORA! I need custom Engineering, IoT & Robotics components for our academic project. Can you help verify availability and pricing?",
      emailSubject: "Engineering & Robotics Hardware Enquiry — VEXORA",
      emailBody: "Hi VEXORA Team,%0D%0A%0D%0AWe require specific IoT / Robotics hardware components for our engineering project.%0D%0APlease let us know the procurement timeline."
    },
    {
      id: 'bulk_stationery',
      label: '📦 Bulk Student Supplies & Lab Stationery',
      badge: 'Institutions & Classes',
      reply: "We curate bulk high-grade bleed-proof journals, drafting tools, tactile design sheets, and lab stationeries with direct student-first pricing and zero middleman markups.",
      whatsappMsg: "Hi VEXORA! We would like to place a bulk order for student stationery, journals, and lab essentials. Please share institutional discounts.",
      emailSubject: "Bulk Supplies & Institutional Order — VEXORA",
      emailBody: "Hi VEXORA Team,%0D%0A%0D%0AWe are looking for bulk student stationery and project supplies for our class/institution."
    },
    {
      id: 'custom_prototype',
      label: '🤝 Custom Prototype & Mentor Collaboration',
      badge: 'Custom Build',
      reply: "Have a unique project idea or need custom component curation? Connect directly with our studio lead to discuss schematic feasibility, custom sourcing, and guidance.",
      whatsappMsg: "Hi VEXORA! We want to discuss a custom prototype or institutional project collaboration with your product team.",
      emailSubject: "Custom Prototype & Project Collaboration — VEXORA",
      emailBody: "Hi VEXORA Team,%0D%0A%0D%0AWe have a custom project prototype requirement and would like to collaborate with your team."
    },
    {
      id: 'event_management',
      label: '🎉 School, College & Corporate Event Management',
      badge: 'Turnkey Events',
      reply: "We plan and execute end-to-end institutional events: School Annual/Sports Days, College Cultural & Tech Fests, DJ Nights, Hackathons, Stage AV/LED setups, custom trophies & merchandise with zero stress.",
      whatsappMsg: "Hi VEXORA! We want to organize an Event (School / College / Corporate). Please connect us with your Event Management squad for planning & quotes.",
      emailSubject: "Event Management Planning & Quote Enquiry — VEXORA",
      emailBody: "Hi VEXORA Events Team,%0D%0A%0D%0AWe are planning an upcoming event (School / College / Corporate) and would like to explore turnkey event management, stage/AV setup, and merchandise support."
    }
  ];

  function getChatbotHTML() {
    return `
      <!-- 3D Project Core Launcher -->
      <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open VEXORA Project Assistant">
        <div class="chatbot-3d-core">
          <svg class="core-3d-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="coreGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#D97706" />
              </linearGradient>
              <linearGradient id="coreGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#60A5FA" />
                <stop offset="100%" stop-color="#2563EB" />
              </linearGradient>
              <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <!-- 3D Isometric Project Cube / Circuit Node -->
            <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" fill="url(#coreGrad2)" opacity="0.35" filter="url(#coreGlow)" />
            <path d="M24 6L40 15V33L24 42L8 33V15L24 6Z" fill="#0B2A4A" stroke="url(#coreGrad1)" stroke-width="1.8" />
            <path d="M24 6L40 15L24 24L8 15L24 6Z" fill="url(#coreGrad2)" opacity="0.8" />
            <path d="M24 24V42L8 33V15L24 24Z" fill="#071B30" />
            <path d="M24 24L40 15V33L24 42V24Z" fill="#143A66" />
            <!-- Floating Glowing Core Spark -->
            <circle cx="24" cy="24" r="4.5" fill="url(#coreGrad1)" filter="url(#coreGlow)" />
            <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
          </svg>
          <span class="core-ping"></span>
        </div>
        <span class="chatbot-toggle-label">Project Desk</span>
      </button>

      <!-- Chatbot Window -->
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <img src="${window.VEXORA ? VEXORA.resolvePath('assets/images/logo/logo.jpeg') : 'assets/images/logo/logo.jpeg'}" alt="VEXORA Agent">
            </div>
            <div>
              <div class="chatbot-title-row">
                <h4>VEXORA Project Desk</h4>
                <span class="chatbot-status-badge">ONLINE</span>
              </div>
              <p class="chatbot-sub">School & College Project Specialists</p>
            </div>
          </div>
          <button class="chatbot-close" id="chatbotClose" aria-label="Close Assistant">×</button>
        </div>
        
        <div class="chatbot-messages" id="chatbotMessages">
          <!-- Messages & dynamic options injected here -->
        </div>

        <div class="chatbot-action-bar" id="chatbotActionBar">
          <button type="button" class="chat-restart-btn" id="chatRestartBtn" style="display:none;">
            ↺ Explore other options
          </button>
        </div>
      </div>
    `;
  }

  function appendMessage(htmlContent, isBot = true, isTyping = false) {
    const msgContainer = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = `chat-msg ${isBot ? 'bot-msg' : 'user-msg'}`;
    
    if (isTyping) {
      div.id = 'typingIndicator';
      div.innerHTML = `
        <div class="chat-bubble typing">
          <span></span><span></span><span></span>
        </div>
      `;
    } else {
      div.innerHTML = `<div class="chat-bubble">${htmlContent}</div>`;
    }
    
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return div;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  async function showInitialFlow() {
    hasStarted = true;
    const msgContainer = document.getElementById('chatbotMessages');
    msgContainer.innerHTML = '';
    document.getElementById('chatRestartBtn').style.display = 'none';

    // Step 1: Greeting
    appendMessage('', true, true);
    await new Promise(r => setTimeout(r, 600));
    removeTypingIndicator();
    appendMessage("<strong>Welcome to VEXORA!</strong> 👋 We specialize in verified components, STEM kits, and project supplies for <strong>schools & colleges</strong>.", true);

    // Step 2: Prompt selection
    appendMessage('', true, true);
    await new Promise(r => setTimeout(r, 500));
    removeTypingIndicator();
    appendMessage("Select your project or academic requirement below to receive direct stock support & pre-filled instant enquiry:", true);

    // Step 3: Render 4 Interactive Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'chat-options-grid';
    optionsDiv.innerHTML = OPTIONS.map(opt => `
      <button type="button" class="chat-opt-card" data-opt-id="${opt.id}">
        <span class="opt-badge">${opt.badge}</span>
        <span class="opt-title">${opt.label}</span>
      </button>
    `).join('');
    
    msgContainer.appendChild(optionsDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    optionsDiv.querySelectorAll('.chat-opt-card').forEach(btn => {
      btn.addEventListener('click', () => handleOptionClick(btn.getAttribute('data-opt-id')));
    });
  }

  async function handleOptionClick(optionId) {
    const opt = OPTIONS.find(o => o.id === optionId);
    if (!opt) return;

    // User message
    appendMessage(opt.label, false);

    // Disable clicked options
    document.querySelectorAll('.chat-opt-card').forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    });

    // Bot typing
    appendMessage('', true, true);
    await new Promise(r => setTimeout(r, 700));
    removeTypingIndicator();

    // Bot Response with Pre-filled Direct Contact Actions
    const cfg = window.VEXORA ? await VEXORA.loadSiteConfig() : {
      whatsappNumber: '918428817610',
      email: 'vedanexus8@gmail.com'
    };

    const waLink = 'https://wa.me/' + cfg.whatsappNumber + '?text=' + encodeURIComponent(opt.whatsappMsg);
    const mailLink = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(opt.emailSubject) + '&body=' + opt.emailBody;

    const responseHTML = `
      <p style="margin-bottom: 12px;">${opt.reply}</p>
      <div class="chat-direct-box">
        <span class="chat-direct-kicker">DIRECT INSTANT ACTION</span>
        <div class="chat-cta-group">
          <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-accent btn-sm chat-btn-wa">
            📱 Chat on WhatsApp
          </a>
          <a href="${mailLink}" class="btn btn-outline btn-sm chat-btn-mail">
            ✉️ Send Official Email
          </a>
        </div>
      </div>
    `;

    appendMessage(responseHTML, true);
    document.getElementById('chatRestartBtn').style.display = 'inline-flex';
  }

  function toggleChat() {
    const win = document.getElementById('chatbotWindow');
    const toggleBtn = document.getElementById('chatbotToggle');
    isOpen = !isOpen;
    
    if (isOpen) {
      win.classList.add('is-open');
      toggleBtn.classList.add('is-active');
      if (!hasStarted) {
        showInitialFlow();
      }
    } else {
      win.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
    }
  }

  function init() {
    if (isInit) return;
    
    const div = document.createElement('div');
    div.id = 'chatbot-container';
    div.innerHTML = getChatbotHTML();
    document.body.appendChild(div);

    document.getElementById('chatbotToggle').addEventListener('click', toggleChat);
    document.getElementById('chatbotClose').addEventListener('click', toggleChat);
    document.getElementById('chatRestartBtn').addEventListener('click', () => showInitialFlow());

    isInit = true;
  }

  return { init };
})();

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
  Chatbot.init();
});

