export default {
  home: {
    badge: "Introducing v2.0: faster than ever",
    title: "Build something people love, without the busywork",
    description:
      "Go from idea to launch in days, not months. One focused workspace with thoughtful defaults, so your team can spend its time on the work that matters.",
    getStarted: "Get started free",
    seeHowItWorks: "See how it works",
    note: "Free to start · No credit card required",
    cards: {
      roadmap: {
        title: "Roadmap cleared",
        description: "12 tasks closed today",
        badge: "Done",
      },
      shipped: {
        title: "v2.0 shipped",
        description: "Launched two minutes ago",
        badge: "Live",
      },
      team: {
        title: "Team is growing",
        description: "3 invites accepted",
        badge: "+3",
      },
    },
  },
  status: {
    metadata: {
      title: "Status - v-stack",
      description: "Live health checks for v-stack.",
    },
    badge: "Status",
    title: "System status",
    description: "Health checks run live on every visit.",
    jsonApi: "JSON API",
    overall: {
      operational: "All systems operational",
      degraded: "Degraded performance",
      outage: "Service disruption",
    },
    checkedAt: "Checked {time} UTC",
    table: {
      check: "Check",
      latency: "Latency",
      status: "Status",
    },
    latency: "{value} ms",
    badges: {
      operational: "Operational",
      degraded: "Degraded",
      outage: "Outage",
    },
    details: {
      version: "Version",
      environment: "Environment",
      runtime: "Runtime",
      uptime: "Server uptime",
    },
  },
  legal: {
    badge: "Legal",
    updated: "Last updated: {date, date, long}",
  },
  terms: {
    metadata: {
      title: "Terms of Service - v-stack",
      description: "The terms that govern your use of v-stack.",
    },
    title: "Terms of Service",
    description:
      "The rules for using v-stack and the commitments we make to each other.",
    sections: {
      acceptance: {
        title: "Acceptance of terms",
        body: "By using v-stack you agree to these terms and our Privacy Policy. If you use the service for an organization, you confirm you have authority to bind it. If you do not agree, do not use the service.",
      },
      use: {
        title: "Use of the service",
        body: "Use the service lawfully and responsibly. Do not probe or disrupt it, attempt unauthorized access, store unlawful or infringing content, or resell it without our written consent.",
      },
      accounts: {
        title: "Accounts",
        body: "Keep your account information accurate and your credentials secure. You are responsible for all activity under your account. Tell us immediately if you suspect unauthorized use.",
      },
      billing: {
        title: "Subscriptions & billing",
        body: "Paid plans bill in advance on a recurring cycle and renew until you cancel; your plan stays active through the paid period. Prices may change with reasonable advance notice.",
      },
      content: {
        title: "Your content & our IP",
        body: "You own the content you create; you grant us a limited license to host and display it solely to run the service. The service itself, including its branding, remains ours.",
      },
      termination: {
        title: "Termination",
        body: "You may delete your account at any time. We may suspend or end access for conduct that violates these terms or harms the service. Key sections survive termination.",
      },
      liability: {
        title: "Disclaimer & liability",
        body: "The service is provided as-is, without warranties of any kind. To the fullest extent the law allows, we are not liable for indirect or consequential damages or lost profits or data.",
      },
      law: {
        title: "Governing law",
        body: "These terms are governed by the laws of the jurisdiction where v-stack is established, and disputes are resolved in its courts unless applicable law provides otherwise.",
      },
      changes: {
        title: "Changes to these terms",
        body: "We may update these terms over time. For material changes we give reasonable notice, and continued use after a change takes effect counts as acceptance.",
      },
    },
  },
  privacy: {
    metadata: {
      title: "Privacy Policy - v-stack",
      description: "How v-stack collects, uses, and protects your information.",
    },
    title: "Privacy Policy",
    description:
      "What we collect, why we collect it, and the choices you have.",
    sections: {
      collection: {
        title: "Information we collect",
        body: "Account details you provide (name, email, password), the content you create, and data collected automatically: usage patterns and device information such as browser, OS, and IP address.",
      },
      use: {
        title: "How we use it",
        body: "To provide, maintain, and improve the service, communicate with you, and keep the service secure. We never use your content to train models or show you third-party ads.",
      },
      sharing: {
        title: "Sharing",
        body: "We do not sell your personal information. We share it only with service providers under confidentiality, when the law requires it, or as part of a merger or acquisition with prior notice.",
      },
      cookies: {
        title: "Cookies",
        body: "We use cookies needed to run the service, like keeping you signed in and remembering preferences. Optional analytics cookies can be controlled in your browser or our settings.",
      },
      retention: {
        title: "Data retention",
        body: "We keep your information while your account is active or as legally required. When you delete your account, personal data is deleted or anonymized within a reasonable period.",
      },
      security: {
        title: "Security",
        body: "We protect your data with encryption in transit, access controls, and regular reviews. No system is completely secure, so we cannot guarantee absolute security.",
      },
      rights: {
        title: "Your rights",
        body: "Depending on where you live, you can access, correct, delete, or export your personal information, and object to or restrict certain processing. Contact us to exercise these rights.",
      },
      children: {
        title: "Children & transfers",
        body: "The service is not directed at children under 13 and we do not knowingly collect their data. Cross-border transfers rely on safeguards such as standard contractual clauses.",
      },
      changes: {
        title: "Changes to this policy",
        body: "We may update this policy and will post changes here with a new date. For material changes we give additional notice before they take effect.",
      },
    },
  },
  blog: {
    metadata: {
      title: "Blog - v-stack",
      description:
        "Writing on programming, AI, and building products on a solid foundation.",
    },
    badge: "Blog",
    title: "Notes from the workbench",
    description:
      "Writing on programming, AI, and building products on a solid foundation.",
    backToBlog: "← Back to blog",
  },
  docs: {
    metadata: {
      title: "Docs - v-stack",
      description:
        "How v-stack is built: architecture, patterns, and the conventions behind the codebase.",
    },
    badge: "Docs",
    title: "Documentation",
    description:
      "How v-stack is built: architecture, patterns, and the conventions behind the codebase.",
    navigation: "Documentation",
    previous: "Previous",
    next: "Next",
  },
} as const
