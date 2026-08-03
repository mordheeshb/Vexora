/* ==========================================================================
   VEXORA — Apple-Grade Catalog & Data Engine
   ========================================================================== */

/* Resolves image/asset paths correctly whether the current page lives at
   the project root (index.html) or one level deep (pages/*.html). */
const BASE_PATH = location.pathname.includes("/pages/") ? "../" : "";

const Catalog = {
  phone: "918428817610",
  email: "vedanexus8@gmail.com",

  /* ----------------------------------------------------------------------
     1. FULL CATEGORY & SUBCATEGORY MAP
     ---------------------------------------------------------------------- */
  categories: [
    {
      id: "stationery-writing",
      name: "Stationery & Writing",
      icon: "🖊️",
      subcategories: [
        "Pens", "Pencils", "Erasers", "Sharpeners", "Rulers & scales", 
        "Highlighters", "Markers", "Premium pens", "Parker & branded pens"
      ]
    },
    {
      id: "notebooks-paper",
      name: "Notebooks & Paper Products",
      icon: "📓",
      subcategories: [
        "Notebooks", "Long notebooks", "A4/A5 notebooks", "Journals", 
        "Diaries", "Scrapbooks", "Drawing books", "Writing pads", "Sticky notes"
      ]
    },
    {
      id: "files-folders",
      name: "Files & Folders",
      icon: "📁",
      subcategories: ["Files & folders"]
    },
    {
      id: "school-supplies",
      name: "School Supplies",
      icon: "🎒",
      subcategories: [
        "School kits", "Geometry boxes", "Pencil boxes", "Water bottles", 
        "School accessories", "Name labels", "Educational supplies"
      ]
    },
    {
      id: "art-craft",
      name: "Art, Craft & Creativity",
      icon: "🎨",
      subcategories: [
        "Colour pencils", "Sketch pens", "Crayons", "Paints", "Brushes", 
        "Craft paper", "Glue", "Scissors", "Stickers", "DIY craft materials"
      ]
    },
    {
      id: "project-materials",
      name: "Project Materials",
      icon: "📐",
      subcategories: [
        "Foam boards", "Cardboards", "Thermocol", "Chart papers", "Wires", 
        "LEDs", "Motors", "Switches", "Batteries", "Connectors", "General project-making materials"
      ]
    },
    {
      id: "electronics-diy",
      name: "Electronics & DIY Kits",
      icon: "⚡",
      subcategories: [
        "Arduino-based kits", "Sensors", "Breadboards", "Jumper wires", 
        "Electronic components", "Robotics kits", "STEM kits", "DIY experiment kits", "School exhibition kits"
      ]
    },
    {
      id: "toys-kids",
      name: "Toys & Kids",
      icon: "🧸",
      subcategories: [
        "Educational toys", "Building blocks", "Toy sets", "Cars", 
        "Dolls", "Puzzles", "Activity sets", "Indoor games", "Outdoor toys", "Balls & sports toys"
      ]
    },
    {
      id: "educational-learning",
      name: "Educational & Learning",
      icon: "💡",
      subcategories: [
        "Learning kits", "Science experiment kits", "Mathematics learning products", 
        "Flash cards", "Activity books", "Educational games"
      ]
    },
    {
      id: "gadgets-accessories",
      name: "Gadgets & Accessories",
      icon: "🎧",
      subcategories: [
        "Small electronic gadgets", "Mobile accessories", "USB accessories", 
        "Desk gadgets", "Study gadgets", "Massage gadgets", "Useful everyday gadgets"
      ]
    },
    {
      id: "office-supplies",
      name: "Office Supplies",
      icon: "💼",
      subcategories: [
        "Office stationery", "Files", "Folders", "Staplers", "Paper clips", 
        "Registers", "Printer paper", "Desk organizers", "Packaging supplies"
      ]
    },
    {
      id: "premium-gifts",
      name: "Premium & Corporate Gifts",
      icon: "🎁",
      subcategories: [
        "Premium pens", "Executive notebooks", "Gift sets", 
        "Desk accessories", "Corporate stationery", "Customized gift kits"
      ]
    },
    {
      id: "sports-recreation",
      name: "Sports & Recreation",
      icon: "⚽",
      subcategories: [
        "Balls", "Skipping ropes", "Basic sports equipment", 
        "Indoor games", "Outdoor games", "Fitness/recreation accessories"
      ]
    },
    {
      id: "stickers-personalization",
      name: "Stickers & Personalization",
      icon: "✨",
      subcategories: [
        "Decorative stickers", "Educational stickers", "School labels", 
        "Name stickers", "Custom stickers", "Promotional stickers"
      ]
    },
    {
      id: "gift-party",
      name: "Gift & Party Supplies",
      icon: "🎉",
      subcategories: [
        "Gift items", "Gift wrapping", "Greeting cards", 
        "Party accessories", "Return gifts", "Children's gift sets"
      ]
    }
  ],

  /* ----------------------------------------------------------------------
     2. PRODUCTS DATABASE
     ---------------------------------------------------------------------- */
  products: [
    {
      id: "vx-01",
      name: "Parker Vector Matte Black Fountain Pen",
      category: "stationery-writing",
      subcategory: "Parker & branded pens",
      price: "450",
      rating: "4.9",
      image: BASE_PATH + "assets/images/misc/hero.svg",
      tag: "Best Seller",
      desc: "Precision steel nib with ultra-smooth ink flow for sleek everyday signatures."
    },
    {
      id: "vx-02",
      name: "VEXORA Minimalist Lay-Flat A5 Journal (120gsm)",
      category: "notebooks-paper",
      subcategory: "A4/A5 notebooks",
      price: "299",
      rating: "4.8",
      image: BASE_PATH + "assets/images/misc/about.svg",
      tag: "Bleed Proof",
      desc: "Designed specifically for fountain pens and heavy ink study markers."
    },
    {
      id: "vx-03",
      name: "Arduino UNO R3 Ultimate Starter Science Kit",
      category: "electronics-diy",
      subcategory: "Arduino-based kits",
      price: "1299",
      rating: "5.0",
      image: BASE_PATH + "assets/images/misc/hero.svg",
      tag: "STEM Approved",
      desc: "Includes sensors, motors, breadboard, and 65x jumper wires for lab projects."
    },
    {
      id: "vx-04",
      name: "Ergonomic Felt Desk Organizer Mat (Large)",
      category: "gadgets-accessories",
      subcategory: "Desk gadgets",
      price: "499",
      rating: "4.9",
      image: BASE_PATH + "assets/images/misc/about.svg",
      tag: "Student Fav",
      desc: "Non-slip, water-resistant merino wool blend felt pad for laptop setups."
    }
  ],

  /* ----------------------------------------------------------------------
     3. APPLE-GRADE RENDER ENGINE METHODS
     ---------------------------------------------------------------------- */

  // Render Subcategory / Category Nav Buttons
  renderCategoryFilterPills(containerSelector, activeCategoryId = 'all') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let html = `
      <button class="pill-btn ${activeCategoryId === 'all' ? 'is-active' : ''}" data-category="all">
        ✨ All Categories
      </button>
    `;

    html += this.categories.map(cat => `
      <button class="pill-btn ${activeCategoryId === cat.id ? 'is-active' : ''}" data-category="${cat.id}">
        <span>${cat.icon}</span> ${cat.name}
      </button>
    `).join('');

    container.innerHTML = html;
  },

  // Render Grid Cards with Subtle Micro-Interactions
  renderProductsGrid(containerSelector, filterCategory = 'all', searchQuery = '') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let items = this.products;

    if (filterCategory !== 'all') {
      items = items.filter(p => p.category === filterCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.subcategory.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(0,0,0,0.02); border-radius: 20px;">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-weight: 700; font-size: 18px; margin-bottom: 6px;">No products found</h3>
          <p style="color: #666; font-size: 14px;">Try searching for another item or clear your current filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(p => `
      <article class="apple-card" style="background: var(--color-surface-card, #ffffff); border-radius: 18px; padding: 18px; border: 1px solid rgba(0,0,0,0.06); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
        <div>
          <div style="position: relative; background: #f8fafc; border-radius: 14px; padding: 20px; height: 190px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; overflow: hidden;">
            <img src="${p.image}" alt="${p.name}" loading="lazy" style="max-height: 100%; max-width: 100%; object-fit: contain; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06)); transition: transform 0.4s ease;">
            ${p.tag ? `<span style="position: absolute; top: 10px; left: 10px; background: rgba(0, 123, 255, 0.1); color: #007BFF; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;">${p.tag}</span>` : ''}
            <span style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: 700;">★ ${p.rating}</span>
          </div>
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-primary, #007BFF); letter-spacing: 0.5px;">${p.subcategory}</span>
          <h3 style="font-size: 16px; font-weight: 700; color: #1d1d1f; margin: 6px 0 8px; line-height: 1.35;">${p.name}</h3>
          <p style="font-size: 13px; color: #86868b; line-height: 1.4; margin-bottom: 16px;">${p.desc}</p>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; pt: 12px; border-top: 1px solid rgba(0,0,0,0.04);">
          <div>
            <span style="font-size: 11px; color: #86868b; display: block;">Price</span>
            <span style="font-size: 19px; font-weight: 800; color: #1d1d1f;">₹${p.price}</span>
          </div>
          <a data-contact="whatsapp" data-message="Hi VEXORA! I want to inquire/order ${p.name} (₹${p.price})." href="#" class="btn btn-accent btn-sm" style="border-radius: 20px; padding: 8px 18px; font-size: 13px; font-weight: 600;">
            Buy Now
          </a>
        </div>
      </article>
    `).join('');
  },

  // Render Dynamic Featured Grid on Homepage
  renderFeaturedGrid(containerSelector, limit = 4) {
    this.renderProductsGrid(containerSelector, 'all', '');
  },

  // Render Full Category Navigator
  renderCategoryNavigator(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div style="background: var(--color-surface-card, #ffffff); border-radius: 24px; padding: 28px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px;">Explore 15 Primary Product Aisles</h2>
        <p style="color: #86868b; font-size: 14px; margin-bottom: 24px;">Click any aisle to view specific sub-items and student kits.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
          ${this.categories.map(cat => `
            <div class="category-tile" style="padding: 16px; border-radius: 14px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.04); transition: transform 0.2s ease;">
              <div style="font-size: 24px; margin-bottom: 8px;">${cat.icon}</div>
              <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 6px;">${cat.name}</h4>
              <p style="font-size: 12px; color: #666; line-height: 1.3;">${cat.subcategories.slice(0, 3).join(', ')}...</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};