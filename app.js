// Mock Data
const mockData = {
  documents: [
    {
      id: "doc1",
      name: "Employee Onboarding SOP",
      type: "SOP",
      category: "HR",
      size: "156 KB",
      uploadDate: "2025-09-08",
      status: "processed",
      content: "Standard Operating Procedure for Employee Onboarding...",
      tags: ["onboarding", "HR", "process"]
    },
    {
      id: "doc2", 
      name: "Company Vision 2025",
      type: "Vision",
      category: "Strategy",
      size: "89 KB", 
      uploadDate: "2025-09-07",
      status: "processed",
      content: "Our vision is to become the leading provider of innovative business solutions...",
      tags: ["vision", "strategy", "2025"]
    },
    {
      id: "doc3",
      name: "Customer Service Process",
      type: "Process", 
      category: "Customer Service",
      size: "234 KB",
      uploadDate: "2025-09-06", 
      status: "processing",
      content: "Customer service escalation procedures and best practices...",
      tags: ["customer", "service", "escalation"]
    }
  ],
  agents: [
    {
      id: "strategy-agent",
      name: "Strategy Analyst",
      description: "Specializes in strategic planning, vision analysis, and business development",
      enabled: true,
      specialties: ["strategy", "vision", "planning"],
      tools: ["document_search", "analysis", "reporting"],
      status: "active"
    },
    {
      id: "hr-agent", 
      name: "HR Operations Specialist",
      description: "Handles human resources processes, SOPs, and policy questions",
      enabled: true,
      specialties: ["HR", "policies", "SOPs"],
      tools: ["policy_lookup", "process_guidance", "compliance_check"],
      status: "idle"
    },
    {
      id: "operations-agent",
      name: "Operations Manager",
      description: "Manages operational processes, workflow optimization, and efficiency analysis",
      enabled: false,
      specialties: ["operations", "workflows", "optimization"],
      tools: ["process_analysis", "workflow_design", "efficiency_metrics"],
      status: "disabled"
    }
  ],
  apiProviders: [
    {
      name: "OpenAI",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
      status: "disconnected",
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    },
    {
      name: "Anthropic", 
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      status: "disconnected",
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    },
    {
      name: "Google",
      models: ["gemini-1.5-pro", "gemini-1.0-pro"], 
      status: "disconnected",
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    },
    {
      name: "xAI",
      models: ["grok-beta"],
      status: "disconnected", 
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    }
  ],
  conversations: [],
  systemStats: {
    documentsProcessed: 15,
    totalQueries: 47,
    activeAgents: 2,
    successRate: 94.5,
    averageResponseTime: "2.3s",
    knowledgeBaseSizeMB: 150
  }
};

// Application State
let appState = {
  currentTab: 'dashboard',
  isProcessing: false,
  currentConversation: [],
  agentActivity: {
    planning: { active: false, progress: 0, content: "Waiting for query..." },
    execution: { active: false, progress: 0, content: "Waiting for execution..." }
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure DOM is fully loaded
  setTimeout(() => {
    initializeApp();
  }, 100);
});

function initializeApp() {
  setupNavigation();
  renderDashboard();
  renderDocuments();
  setupChat();
  addActivityItem('System started successfully', 'system');
  addActivityItem('Knowledge base loaded', 'database');
  
  // Set current date
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    currentDateElement.textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  if (navItems.length === 0) {
    setTimeout(setupNavigation, 200);
    return;
  }
  
  navItems.forEach(item => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      
      const tabName = item.dataset.tab;
      if (!tabName) return;
      
      // Update nav active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Switch tabs
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add('active');
    appState.currentTab = tabName;
    
    // Load tab-specific content
    if (tabName === 'knowledge') {
      renderDocuments();
    } else if (tabName === 'agents') {
      renderAgentConfiguration();
    }
  }
}

// Dashboard
function renderDashboard() {
  const stats = mockData.systemStats;
  
  // Update metric values
  const metricValues = {
    'knowledge-base-count': '2,847',
    'agent-interactions-count': '1,523',
    'active-agents-count': '7',
    'response-time-value': '1.2s'
  };
  
  Object.entries(metricValues).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  
  renderRecentActivity();
}

function renderRecentActivity() {
  const activityList = document.getElementById('recent-activity');
  if (!activityList) return;
  
  const activities = [
    { message: 'Document "Q3 Strategy Review" processed', time: '2 minutes ago', icon: 'fas fa-file-alt' },
    { message: 'Agent chat session completed', time: '5 minutes ago', icon: 'fas fa-comments' },
    { message: 'Knowledge base updated with 3 new documents', time: '12 minutes ago', icon: 'fas fa-database' },
    { message: 'System health check passed', time: '1 hour ago', icon: 'fas fa-check-circle' }
  ];
  
  activityList.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon">
        <i class="${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-message">${activity.message}</div>
        <div class="activity-time">${activity.time}</div>
      </div>
    </div>
  `).join('');
}

function addActivityItem(message, type) {
  const activityList = document.getElementById('recent-activity');
  if (!activityList) return;
  
  const iconClass = getActivityIcon(type);
  const time = new Date().toLocaleTimeString();
  
  const activityItem = document.createElement('div');
  activityItem.className = 'activity-item';
  activityItem.innerHTML = `
    <div class="activity-icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="activity-content">
      <div class="activity-message">${message}</div>
      <div class="activity-time">${time}</div>
    </div>
  `;
  
  activityList.insertBefore(activityItem, activityList.firstChild);
  
  // Keep only the last 5 items
  if (activityList.children.length > 5) {
    activityList.removeChild(activityList.lastChild);
  }
}

function getActivityIcon(type) {
  const icons = {
    system: 'fas fa-cog',
    database: 'fas fa-database',
    chat: 'fas fa-comment',
    upload: 'fas fa-upload',
    agent: 'fas fa-robot',
    api: 'fas fa-key'
  };
  return icons[type] || 'fas fa-info-circle';
}

// Documents / Knowledge Base
function renderDocuments() {
  const documentsGrid = document.getElementById('documents-grid');
  if (!documentsGrid) return;
  
  documentsGrid.innerHTML = '';
  
  mockData.documents.forEach(doc => {
    const docCard = createDocumentCard(doc);
    documentsGrid.appendChild(docCard);
  });
  
  setupDocumentFilters();
}

function setupDocumentFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      
      // Update active filter
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter documents
      filterDocuments(category);
    });
  });
  
  // Setup search
  const searchInput = document.getElementById('knowledge-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchDocuments(e.target.value);
    });
  }
}

function filterDocuments(category) {
  const documentsGrid = document.getElementById('documents-grid');
  if (!documentsGrid) return;
  
  const filteredDocs = category === 'all' ? 
    mockData.documents : 
    mockData.documents.filter(doc => doc.type === category);
  
  documentsGrid.innerHTML = '';
  filteredDocs.forEach(doc => {
    const docCard = createDocumentCard(doc);
    documentsGrid.appendChild(docCard);
  });
}

function searchDocuments(query) {
  const documentsGrid = document.getElementById('documents-grid');
  if (!documentsGrid) return;
  
  const filteredDocs = mockData.documents.filter(doc => 
    doc.name.toLowerCase().includes(query.toLowerCase()) ||
    doc.content.toLowerCase().includes(query.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  
  documentsGrid.innerHTML = '';
  filteredDocs.forEach(doc => {
    const docCard = createDocumentCard(doc);
    documentsGrid.appendChild(docCard);
  });
}

function createDocumentCard(doc) {
  const card = document.createElement('div');
  card.className = 'document-card';
  
  const statusClass = doc.status === 'processed' ? 'success' : 
                     doc.status === 'processing' ? 'warning' : 'info';
  
  card.innerHTML = `
    <div class="document-header">
      <div class="document-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <div class="status status--${statusClass}">
        ${doc.status}
      </div>
    </div>
    <div class="document-name">${doc.name}</div>
    <div class="document-meta">
      ${doc.type} • ${doc.size} • ${doc.category}
    </div>
    <div class="document-tags">
      ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  `;
  
  return card;
}

// Chat System
function setupChat() {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-message');

  if (!chatInput || !sendButton) return;

  sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        sendMessage(message);
        chatInput.value = '';
      }
    }
  });
}

function sendMessage(message) {
  if (appState.isProcessing) return;

  // Add user message
  addMessageToChat('user-message', message);
  appState.isProcessing = true;

  // Simulate agent response
  setTimeout(() => {
    const response = generateAgentResponse(message);
    addMessageToChat('agent-message', response);
    appState.isProcessing = false;
    
    addActivityItem('Query processed successfully', 'agent');
  }, 1500);

  addActivityItem('New query received', 'chat');
}

function addMessageToChat(type, content) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;

  const message = document.createElement('div');
  message.className = `message ${type}`;

  const avatar = type === 'user-message' ? 
    '<i class="fas fa-user"></i>' : 
    '<i class="fas fa-robot"></i>';

  message.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-text">${content}</div>
      <div class="message-time">Just now</div>
    </div>
  `;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAgentResponse(query) {
  const responses = {
    vision: "Based on our Company Vision 2025 document, our vision is to become the leading provider of innovative business solutions that empower organizations to achieve sustainable growth and digital transformation.",
    onboarding: "According to our Employee Onboarding SOP, the process includes pre-boarding preparation, first day orientation, department-specific training, and 30-60-90 day check-ins.",
    customer: "Our Customer Service Process emphasizes escalation procedures with three tiers: Level 1 (front-line support), Level 2 (technical specialists), and Level 3 (senior management).",
    default: "I've analyzed your query against our knowledge base. Based on the available documents including SOPs, vision statements, and process documentation, I can provide comprehensive guidance on your business operations."
  };
  
  let response = responses.default;
  
  if (query.toLowerCase().includes('vision')) response = responses.vision;
  else if (query.toLowerCase().includes('onboarding')) response = responses.onboarding;
  else if (query.toLowerCase().includes('customer')) response = responses.customer;
  
  return response;
}

// Agent Configuration
function renderAgentConfiguration() {
  const agentsGrid = document.getElementById('agents-grid');
  if (!agentsGrid) return;

  agentsGrid.innerHTML = mockData.agents.map(agent => `
    <div class="agent-config-card">
      <div class="agent-config-header">
        <div>
          <div class="agent-config-name">${agent.name}</div>
          <div class="agent-config-description">${agent.description}</div>
        </div>
        <button class="agent-toggle ${agent.enabled ? 'enabled' : ''}" onclick="toggleAgent('${agent.id}')">
          <i class="fas ${agent.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
        </button>
      </div>
      <div class="agent-specialties">
        <h5>Specialties</h5>
        <div class="specialty-tags">
          ${agent.specialties.map(specialty => `<span class="tag">${specialty}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function toggleAgent(agentId) {
  const agent = mockData.agents.find(a => a.id === agentId);
  if (agent) {
    agent.enabled = !agent.enabled;
    agent.status = agent.enabled ? 'idle' : 'disabled';
    renderAgentConfiguration();
    
    addActivityItem(`${agent.enabled ? 'Enabled' : 'Disabled'} ${agent.name}`, 'agent');
  }
}

// Make functions globally available
window.toggleAgent = toggleAgent;