/* ==========================================================================
   VEXORA — Event Management Interactive Controller
   Handles: Segment tabs, dynamic scope/package estimator, customized
   WhatsApp/Email inquiry links, and FAQ accordions.
   ========================================================================== */

const VexoraEvents = (() => {
  const state = {
    institution: 'College / University',
    eventType: 'Cultural Fest & DJ Night',
    crowd: '500 - 1,500 Attendees',
    services: ['Stage & Line-Array Audio', 'Lighting & 4K LED Walls', 'Custom Merch & Trophies', 'Photo & 4K Video']
  };

  const whatsappNumber = '918428817610';
  const emailAddress = 'vedanexus8@gmail.com';

  function init() {
    initSegmentTabs();
    initEstimator();
    initFaqAccordion();
    initEventInquiryForm();
    updateEstimatorSummary();
  }

  /* ---------------- 1. Segment Switcher Tabs ---------------- */
  function initSegmentTabs() {
    const tabBtns = document.querySelectorAll('.segment-tab-btn');
    const panes = document.querySelectorAll('.segment-pane');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        tabBtns.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(target);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  /* ---------------- 2. Interactive Event Estimator ---------------- */
  function initEstimator() {
    // Institution Type Buttons
    const instBtns = document.querySelectorAll('[data-estimator-inst]');
    instBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        instBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.institution = btn.getAttribute('data-estimator-inst');
        updateEstimatorSummary();
      });
    });

    // Event Type Buttons
    const eventBtns = document.querySelectorAll('[data-estimator-event]');
    eventBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        eventBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.eventType = btn.getAttribute('data-estimator-event');
        updateEstimatorSummary();
      });
    });

    // Crowd / Attendees Buttons
    const crowdBtns = document.querySelectorAll('[data-estimator-crowd]');
    crowdBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        crowdBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.crowd = btn.getAttribute('data-estimator-crowd');
        updateEstimatorSummary();
      });
    });

    // Service Checkboxes
    const serviceChecks = document.querySelectorAll('input[name="event-service"]');
    serviceChecks.forEach(check => {
      check.addEventListener('change', () => {
        const selected = [];
        serviceChecks.forEach(c => {
          if (c.checked) selected.push(c.value);
        });
        state.services = selected.length ? selected : ['Standard Turnkey Support'];
        updateEstimatorSummary();
      });
    });
  }

  function updateEstimatorSummary() {
    const instEl = document.getElementById('estSummaryInst');
    const typeEl = document.getElementById('estSummaryType');
    const crowdEl = document.getElementById('estSummaryCrowd');
    const servicesEl = document.getElementById('estSummaryServices');
    const tierEl = document.getElementById('estSummaryTier');
    const timelineEl = document.getElementById('estSummaryTimeline');
    const whatsappBtn = document.getElementById('estWhatsAppBtn');
    const emailBtn = document.getElementById('estEmailBtn');

    if (instEl) instEl.textContent = state.institution;
    if (typeEl) typeEl.textContent = state.eventType;
    if (crowdEl) crowdEl.textContent = state.crowd;
    if (servicesEl) servicesEl.textContent = state.services.join(', ');

    // Determine Suggested Package Tier & Timeline
    let tier = 'Signature Fest Package';
    let timeline = '2 – 3 Weeks Production';

    if (state.crowd.includes('5,000+') || state.services.length >= 5) {
      tier = 'Grand Mega Extravaganza (Turnkey)';
      timeline = '3 – 5 Weeks Blueprint & Setup';
    } else if (state.crowd.includes('Under 500') || state.services.length <= 2) {
      tier = 'Essential Campus Setup';
      timeline = '5 – 10 Days Fast-Track';
    }

    if (tierEl) tierEl.textContent = tier;
    if (timelineEl) timelineEl.textContent = timeline;

    // Generate Tailored WhatsApp Message
    const msg = `Hi VEXORA Events! We are looking to organize an event.%0A%0A` +
      `🏛️ *Institution:* ${state.institution}%0A` +
      `🎉 *Event Type:* ${state.eventType}%0A` +
      `👥 *Expected Crowd:* ${state.crowd}%0A` +
      `🛠️ *Services Needed:* ${state.services.join(', ')}%0A` +
      `🎯 *Suggested Tier:* ${tier}%0A%0A` +
      `Please share a customized proposal, quote, and available dates.`;

    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${msg}`;
    }

    // Generate Tailored Email Link
    if (emailBtn) {
      const subject = encodeURIComponent(`Event Inquiry: ${state.eventType} for ${state.institution} — VEXORA`);
      const body = encodeURIComponent(
        `Hi VEXORA Events Squad,\n\n` +
        `We would like to request a proposal and quotation for our upcoming event:\n\n` +
        `- Institution: ${state.institution}\n` +
        `- Event Type: ${state.eventType}\n` +
        `- Expected Attendance: ${state.crowd}\n` +
        `- Required Services: ${state.services.join(', ')}\n\n` +
        `Please reach back with quotation details and feasibility.\n\nThank you!`
      );
      emailBtn.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    }
  }

  /* ---------------- 3. FAQ Accordion ---------------- */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (!questionBtn) return;

      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ---------------- 4. Direct Inquiry Form Handler ---------------- */
  function initEventInquiryForm() {
    const form = document.getElementById('eventInquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="client_name"]')?.value || 'Organizer';
      const inst = form.querySelector('[name="institution_name"]')?.value || state.institution;
      const phone = form.querySelector('[name="client_phone"]')?.value || '';
      const notes = form.querySelector('[name="event_notes"]')?.value || 'No extra notes provided.';

      const msg = `Hi VEXORA Events!%0A%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `🏛️ *Institution:* ${encodeURIComponent(inst)}%0A` +
        `📞 *Contact:* ${encodeURIComponent(phone)}%0A` +
        `🎉 *Event:* ${encodeURIComponent(state.eventType)} (${encodeURIComponent(state.crowd)})%0A` +
        `📝 *Requirement Notes:* ${encodeURIComponent(notes)}%0A%0A` +
        `Please connect with us regarding quote and execution.`;

      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
      form.reset();
      alert('Thank you! Redirecting to VEXORA Events WhatsApp for instant confirmation.');
    });
  }

  return { init, updateEstimatorSummary };
})();

document.addEventListener('DOMContentLoaded', () => {
  VexoraEvents.init();
});
